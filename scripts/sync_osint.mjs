#!/usr/bin/env node
/**
 * Coletor OSINT zero-backend para Piauí Teresina Analytics.
 * Executa via GitHub Actions (ou manualmente com Node 22+) para atualizar data/piaui-live.json
 * diretamente de APIs públicas brasileiras e feeds RSS oficiais, sem intermediários pagos.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outFile = path.join(rootDir, 'data', 'piaui-live.json');

async function fetchJson(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'PiauiTeresinaAnalytics-OSINT/2.0' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'PiauiTeresinaAnalytics-OSINT/2.0' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function decodeXmlEntities(text) {
  return String(text || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const EDU_KEYWORDS_RE = /\b(educa[çc][aã]o|escola[rs]?|ceti|semec|seduc|ideb|enem|saeb|obmep|tme[²2]|alfabetiz\w*|professor\w*|estudant\w*|aluno\w*|ifpi|uespi|ufpi|seduckathon|tempo integral|ensino m[ée]dio|ensino fundamental|censo escolar|merenda|matr[íi]cula[s]?)\b/i;

function classifyNewsCategory(title, defaultCategory = 'Atualidades') {
  return EDU_KEYWORDS_RE.test(title) ? 'Educação' : defaultCategory;
}

function parseRssItems(xml, sourceName, expectedHost, defaultCategory = 'Atualidades') {
  const items = [];
  const itemMatches = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  for (const block of itemMatches.slice(0, 25)) {
    const titleMatch = block.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const linkMatch = block.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i);
    const pubMatch = block.match(/<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i);
    if (!titleMatch || !linkMatch || !pubMatch) continue;
    try {
      const url = new URL(decodeXmlEntities(linkMatch[1]));
      if (url.protocol !== 'https:' || url.hostname !== expectedHost) continue;
      const published = new Date(decodeXmlEntities(pubMatch[1]));
      if (!Number.isFinite(published.getTime())) continue;
      const date = published.toISOString().slice(0, 10);
      const title = decodeXmlEntities(titleMatch[1]);
      if (title) {
        items.push({
          date,
          title,
          url: url.href,
          source: sourceName,
          category: classifyNewsCategory(title, defaultCategory),
          feed: true
        });
      }
    } catch (_) {
      // Ignora item malformado
    }
  }
  return items;
}

async function main() {
  const previous = JSON.parse(await fs.readFile(outFile, 'utf8'));
  const snapshot = {
    generatedAt: new Date().toISOString(),
    mode: 'osint-github-actions',
    sources: {
      ibge: { ...previous.sources.ibge },
      bcb: { ...previous.sources.bcb },
      siconfi: { ...previous.sources.siconfi },
      commodities: previous.sources.commodities ? { ...previous.sources.commodities } : { status: 'awaiting_live_sync', icbr: {}, quotes: {} },
      education: previous.sources.education ? { ...previous.sources.education } : { status: 'awaiting_live_sync', ibgeNoticias: [] },
      weather: { ...previous.sources.weather }
    },
    news: []
  };

  // 1. IBGE Localidades (224 municípios PI) + Projeção Brasil
  try {
    const [muns, proj] = await Promise.all([
      fetchJson('https://servicodados.ibge.gov.br/api/v1/localidades/estados/22/municipios'),
      fetchJson('https://servicodados.ibge.gov.br/api/v1/projecoes/populacao/BR')
    ]);
    if (Array.isArray(muns)) {
      snapshot.sources.ibge = {
        uf: 'PI',
        municipiosCount: muns.length,
        populacaoBrasilProjecao: proj?.projecao?.populacao ?? null,
        horarioProjecao: proj?.horario ?? null,
        status: 'ok'
      };
    }
  } catch (err) {
    snapshot.sources.ibge.status = `fallback (${err.message})`;
  }

  // 2. Banco Central do Brasil (Selic 432, IPCA 433, USD/BRL 1)
  try {
    const [selic, ipca, usd] = await Promise.all([
      fetchJson('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json'),
      fetchJson('https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json'),
      fetchJson('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json')
    ]);
    snapshot.sources.bcb = {
      selic: selic?.[0] || null,
      ipca: ipca?.[0] || null,
      usdBrl: usd?.[0] || null,
      status: 'ok'
    };
  } catch (err) {
    snapshot.sources.bcb.status = `fallback (${err.message})`;
  }

  // 3. Clima ao vivo em Teresina e polos do Piauí (Open-Meteo)
  try {
    const weather = await fetchJson(
      'https://api.open-meteo.com/v1/forecast?latitude=-5.0892,-2.9055,-7.0769,-9.0744&longitude=-42.8016,-41.7754,-41.4669,-44.3586&current=temperature_2m,relative_humidity_2m,uv_index,wind_speed_10m&timezone=America/Fortaleza'
    );
    const list = Array.isArray(weather) ? weather : [weather];
    const [ter, phb, pic, bjs] = list;
    snapshot.sources.weather = {
      teresina: ter?.current ? {
        tempC: ter.current.temperature_2m,
        humidity: ter.current.relative_humidity_2m,
        uv: ter.current.uv_index,
        windKmh: ter.current.wind_speed_10m,
        time: ter.current.time,
        status: 'ok'
      } : previous.sources.weather.teresina,
      parnaiba: phb?.current ? { tempC: phb.current.temperature_2m, uv: phb.current.uv_index } : null,
      picos: pic?.current ? { tempC: pic.current.temperature_2m, uv: pic.current.uv_index } : null,
      bomJesus: bjs?.current ? { tempC: bjs.current.temperature_2m, uv: bjs.current.uv_index } : null
    };
  } catch (err) {
    snapshot.sources.weather.teresina.status = `fallback (${err.message})`;
  }

  // 4. Commodities (BCB IC-Br + Yahoo Finance Petróleo/Soja/Milho/Ouro/Gás)
  try {
    const [icbrTot, icbrAgro, icbrMet, icbrEner] = await Promise.allSettled([
      fetchJson('https://api.bcb.gov.br/dados/serie/bcdata.sgs.27574/dados/ultimos/1?formato=json'),
      fetchJson('https://api.bcb.gov.br/dados/serie/bcdata.sgs.27575/dados/ultimos/1?formato=json'),
      fetchJson('https://api.bcb.gov.br/dados/serie/bcdata.sgs.27576/dados/ultimos/1?formato=json'),
      fetchJson('https://api.bcb.gov.br/dados/serie/bcdata.sgs.27577/dados/ultimos/1?formato=json')
    ]);
    const icbr = {
      total: icbrTot.status === 'fulfilled' ? icbrTot.value?.[0] || null : null,
      agro: icbrAgro.status === 'fulfilled' ? icbrAgro.value?.[0] || null : null,
      metal: icbrMet.status === 'fulfilled' ? icbrMet.value?.[0] || null : null,
      energia: icbrEner.status === 'fulfilled' ? icbrEner.value?.[0] || null : null
    };
    const symbols = [
      { id: 'brent', ticker: 'BZ=F', unit: 'USD/barril' },
      { id: 'wti', ticker: 'CL=F', unit: 'USD/barril' },
      { id: 'soja', ticker: 'ZS=F', unit: 'USc/bushel' },
      { id: 'milho', ticker: 'ZC=F', unit: 'USc/bushel' },
      { id: 'ouro', ticker: 'GC=F', unit: 'USD/oz' },
      { id: 'gas_natural', ticker: 'NG=F', unit: 'USD/MMBtu' }
    ];
    const quotes = {};
    await Promise.allSettled(symbols.map(async item => {
      try {
        const yData = await fetchJson(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(item.ticker)}?range=5d&interval=1d`);
        const meta = yData?.chart?.result?.[0]?.meta;
        const price = meta?.regularMarketPrice;
        const prev = meta?.chartPreviousClose;
        if (typeof price === 'number' && Number.isFinite(price)) {
          const changePct = typeof prev === 'number' && prev > 0 ? Number((((price - prev) / prev) * 100).toFixed(2)) : null;
          quotes[item.id] = {
            symbol: item.ticker,
            price: Number(price.toFixed(2)),
            unit: item.unit,
            changePct,
            currency: meta?.currency || 'USD',
            marketTime: meta?.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString()
          };
        }
      } catch (_) {}
    }));
    const hasQuotes = Object.keys(quotes).length > 0;
    const hasIcbr = Object.values(icbr).some(Boolean);
    snapshot.sources.commodities = {
      status: hasQuotes || hasIcbr ? 'ok' : 'fallback',
      icbr,
      quotes: hasQuotes ? quotes : (previous.sources.commodities?.quotes || {})
    };
  } catch (err) {
    snapshot.sources.commodities.status = `fallback (${err.message})`;
  }

  // 5. Tesouro Nacional SICONFI RGF (Estado do Piauí - id_ente=22)
  try {
    const siconfi = await fetchJson(
      'https://apidatalake.tesouro.gov.br/ords/siconfi/tt/rgf?an_exercicio=2025&in_periodicidade=Q&nr_periodo=3&co_tipo_demonstrativo=RGF&no_anexo=RGF-Anexo%2001&co_esfera=E&co_poder=E&id_ente=22',
      10000
    );
    if (siconfi && Array.isArray(siconfi.items) && siconfi.items.length) {
      snapshot.sources.siconfi = {
        status: 'ok',
        exercicio: 2025,
        periodo: 3,
        itens: siconfi.items.length
      };
    }
  } catch (err) {
    snapshot.sources.siconfi.status = `fallback (${err.message})`;
  }

  // 6. IBGE Educação Notícias + RSS direto de SEDUC-PI, g1 Piauí e Governo do Piauí (sem rss2json)
  try {
    const eduIbge = await fetchJson('https://servicodados.ibge.gov.br/api/v3/noticias/?busca=educacao&qtd=6', 10000);
    if (eduIbge && Array.isArray(eduIbge.items)) {
      snapshot.sources.education = {
        status: 'ok',
        ibgeNoticias: eduIbge.items
          .filter(item => typeof item.link === 'string' && /^https:\/\//.test(item.link))
          .slice(0, 6)
          .map(item => ({
            title: item.titulo,
            date: item.data_publicacao,
            url: item.link
          }))
      };
    }
  } catch (err) {
    snapshot.sources.education = {
      ...(snapshot.sources.education || {}),
      status: `fallback (${err.message})`
    };
  }

  const rssTargets = [
    { name: 'SEDUC-PI', url: 'https://www.seduc.pi.gov.br/feed/', host: 'www.seduc.pi.gov.br', defaultCategory: 'Educação' },
    { name: 'g1 Piauí', url: 'https://g1.globo.com/rss/g1/pi/piaui/', host: 'g1.globo.com', defaultCategory: 'Atualidades' },
    { name: 'Governo do Piauí', url: 'https://www.pi.gov.br/feed/', host: 'www.pi.gov.br', defaultCategory: 'Atualidades' }
  ];
  const collectedNews = new Map();
  for (const src of rssTargets) {
    try {
      const xml = await fetchText(src.url);
      for (const item of parseRssItems(xml, src.name, src.host, src.defaultCategory)) {
        if (!collectedNews.has(item.url)) collectedNews.set(item.url, item);
      }
    } catch (_) {
      // Mantém fontes que responderam
    }
  }
  const freshNews = [...collectedNews.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 50);
  snapshot.news = freshNews.length ? freshNews : (Array.isArray(previous.news) ? previous.news : []);

  await fs.writeFile(outFile, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  console.log('Snapshot atualizado:', outFile, 'Notícias:', snapshot.news.length);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
