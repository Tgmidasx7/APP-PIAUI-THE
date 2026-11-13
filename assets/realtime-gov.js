/**
 * SALA DE SITUAÇÃO GOV-BR — SINCRONIZAÇÃO EM TEMPO REAL
 * Consulta APIs públicas oficiais brasileiras (IBGE, BCB, SICONFI) e telemetria ambiental (Open-Meteo),
 * além do snapshot OSINT em data/piaui-live.json. Mantém fallback local seguro offline.
 */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);

  const state = {
    status: 'baseline', // baseline | syncing | online | partial | offline
    lastSync: null,
    modeLabel: 'BASE LOCAL (ESTÁTICA)',
    weather: {
      teresina: { tempC: null, humidity: null, uv: null, windKmh: null, status: 'local' },
      parnaiba: null,
      picos: null,
      bomJesus: null
    },
    bcb: {
      selic: null,
      ipca: null,
      usdBrl: null,
      status: 'local'
    },
    ibge: {
      municipiosCount: 224,
      municipios: [],
      populacaoBrasilProjecao: null,
      noticias: [],
      status: 'local'
    },
    siconfi: {
      status: 'local',
      exercicio: null,
      periodo: null,
      itens: 0
    },
    commodities: {
      status: 'local',
      generatedAt: null,
      icbr: { total: null, agro: null, metal: null, energia: null },
      quotes: {}
    },
    snapshotNews: []
  };

  let syncing = false;
  let initialized = false;
  const listeners = new Set();

  function formatTimeBR(date = new Date()) {
    try {
      return date.toLocaleTimeString('pt-BR', {
        timeZone: 'America/Fortaleza',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (_) {
      return date.toTimeString().slice(0, 8);
    }
  }

  async function fetchJsonSafe(url, timeoutMs = 8000) {
    if (typeof window.fetch !== 'function') {
      throw new Error('fetch_unavailable');
    }
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      const response = await window.fetch(url, controller ? { signal: controller.signal } : undefined);
      if (!response || !response.ok) {
        throw new Error('http_' + (response ? response.status : 'err'));
      }
      return await response.json();
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  function notify() {
    renderLiveBar();
    const detail = getState();
    listeners.forEach(fn => {
      try { fn(detail); } catch (_) {}
    });
    document.dispatchEvent(new CustomEvent('piaui:realtime-update', { detail }));
  }

  function getState() {
    return {
      ...state,
      weather: { ...state.weather, teresina: { ...state.weather.teresina } },
      bcb: { ...state.bcb },
      ibge: { ...state.ibge },
      siconfi: { ...state.siconfi },
      commodities: {
        ...state.commodities,
        icbr: { ...state.commodities.icbr },
        quotes: { ...state.commodities.quotes }
      }
    };
  }

  function renderLiveBar() {
    const badge = $('#govLiveBadge');
    const syncTime = $('#govLiveTimestamp');
    const weatherVal = $('#govLiveWeather');
    const weatherSub = $('#govLiveWeatherSub');
    const bcbVal = $('#govLiveBcb');
    const bcbSub = $('#govLiveBcbSub');
    const ibgeVal = $('#govLiveIbge');
    const ibgeSub = $('#govLiveIbgeSub');
    const siconfiVal = $('#govLiveSiconfi');
    const siconfiSub = $('#govLiveSiconfiSub');

    if (badge) {
      badge.dataset.state = state.status;
      badge.textContent = state.modeLabel;
    }
    if (syncTime) {
      syncTime.textContent = state.lastSync ? `Última checagem: ${state.lastSync} (BRT)` : 'Aguardando sincronização';
    }

    if (weatherVal && weatherSub) {
      const t = state.weather.teresina;
      if (t && t.tempC != null) {
        weatherVal.textContent = `${Number(t.tempC).toFixed(1)}°C`;
        weatherSub.textContent = `Teresina ao vivo · Umid. ${t.humidity ?? '—'}% · UV ${t.uv ?? '—'}`;
      } else {
        weatherVal.textContent = 'Estático';
        weatherSub.textContent = 'Teresina: conecte para clima ao vivo';
      }
    }

    if (bcbVal && bcbSub) {
      if (state.bcb.selic && state.bcb.selic.valor != null) {
        bcbVal.textContent = `Selic ${state.bcb.selic.valor}%`;
        const parts = [];
        if (state.bcb.ipca && state.bcb.ipca.valor != null) parts.push(`IPCA ${state.bcb.ipca.valor}%`);
        if (state.bcb.usdBrl && state.bcb.usdBrl.valor != null) parts.push(`USD R$ ${Number(String(state.bcb.usdBrl.valor).replace(',', '.')).toFixed(2)}`);
        bcbSub.textContent = `BCB SGS (${state.bcb.selic.data || 'atual'})` + (parts.length ? ' · ' + parts.join(' · ') : '');
      } else {
        bcbVal.textContent = 'BCB SGS';
        bcbSub.textContent = 'Selic / IPCA / PTAX aguardando sync';
      }
    }

    if (ibgeVal && ibgeSub) {
      ibgeVal.textContent = `${state.ibge.municipiosCount || 224} municípios`;
      if (state.ibge.populacaoBrasilProjecao) {
        ibgeSub.textContent = `IBGE API · Pop. BR proj.: ${Number(state.ibge.populacaoBrasilProjecao).toLocaleString('pt-BR')}`;
      } else {
        ibgeSub.textContent = 'UF 22 (PI) · IBGE Localidades';
      }
    }

    if (siconfiVal && siconfiSub) {
      if (state.siconfi.status === 'ok') {
        siconfiVal.textContent = `RGF ${state.siconfi.exercicio}`;
        siconfiSub.textContent = `Tesouro SICONFI · ${state.siconfi.itens} linhas (${state.siconfi.periodo}º quad.)`;
      } else {
        siconfiVal.textContent = 'DCL 56,1% RCL';
        siconfiSub.textContent = 'R$ 10,93 bi / R$ 19,5 bi (61% ref. ant.)';
      }
    }
  }

  async function loadLocalSnapshot() {
    if (typeof window.location !== 'object' || !/^https?:$/.test(window.location.protocol)) {
      return false;
    }
    const base = window.location.pathname.includes('/eyeofgod') ? '../data/piaui-live.json' : 'data/piaui-live.json';
    try {
      const snap = await fetchJsonSafe(base, 5000);
      if (snap && snap.sources) {
        if (snap.sources.weather && snap.sources.weather.teresina && snap.sources.weather.teresina.tempC != null) {
          state.weather = { ...state.weather, ...snap.sources.weather };
        }
        if (snap.sources.bcb && snap.sources.bcb.selic) {
          state.bcb = { ...state.bcb, ...snap.sources.bcb };
        }
        if (snap.sources.ibge && snap.sources.ibge.municipiosCount) {
          state.ibge = { ...state.ibge, ...snap.sources.ibge };
        }
        if (snap.sources.siconfi && snap.sources.siconfi.status === 'ok') {
          state.siconfi = { ...state.siconfi, ...snap.sources.siconfi };
        }
        if (snap.sources.commodities) {
          state.commodities = {
            ...state.commodities,
            ...snap.sources.commodities,
            generatedAt: snap.generatedAt || null,
            icbr: { ...state.commodities.icbr, ...(snap.sources.commodities.icbr || {}) },
            quotes: { ...state.commodities.quotes, ...(snap.sources.commodities.quotes || {}) }
          };
        }
        if (Array.isArray(snap.news)) {
          state.snapshotNews = snap.news;
        }
        return true;
      }
    } catch (_) {}
    return false;
  }

  async function syncAll() {
    if (syncing) return getState();
    syncing = true;
    state.status = 'syncing';
    state.modeLabel = 'SINCRONIZANDO GOV-BR…';
    notify();

    if (typeof window.fetch !== 'function') {
      state.status = 'offline';
      state.modeLabel = 'BASE LOCAL (OFFLINE)';
      state.lastSync = formatTimeBR();
      syncing = false;
      notify();
      return getState();
    }

    const snapLoaded = await loadLocalSnapshot();

    let okCount = 0;
    const tasks = [
      // 1. Clima ao vivo em Teresina e polos do Piauí (Open-Meteo)
      fetchJsonSafe(
        'https://api.open-meteo.com/v1/forecast?latitude=-5.0892,-2.9055,-7.0769,-9.0744&longitude=-42.8016,-41.7754,-41.4669,-44.3586&current=temperature_2m,relative_humidity_2m,uv_index,wind_speed_10m&timezone=America/Fortaleza'
      ).then(data => {
        const list = Array.isArray(data) ? data : [data];
        const [ter, phb, pic, bjs] = list;
        if (ter && ter.current) {
          state.weather.teresina = {
            tempC: ter.current.temperature_2m,
            humidity: ter.current.relative_humidity_2m,
            uv: ter.current.uv_index,
            windKmh: ter.current.wind_speed_10m,
            status: 'ok'
          };
          if (phb && phb.current) state.weather.parnaiba = { tempC: phb.current.temperature_2m, uv: phb.current.uv_index };
          if (pic && pic.current) state.weather.picos = { tempC: pic.current.temperature_2m, uv: pic.current.uv_index };
          if (bjs && bjs.current) state.weather.bomJesus = { tempC: bjs.current.temperature_2m, uv: bjs.current.uv_index };
          okCount++;
        }
      }),

      // 2. Banco Central do Brasil (Selic, IPCA, PTAX)
      Promise.allSettled([
        fetchJsonSafe('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json'),
        fetchJsonSafe('https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json'),
        fetchJsonSafe('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json')
      ]).then(results => {
        const [selic, ipca, usd] = results;
        let bcbOk = false;
        if (selic.status === 'fulfilled' && Array.isArray(selic.value) && selic.value[0]) {
          state.bcb.selic = selic.value[0];
          bcbOk = true;
        }
        if (ipca.status === 'fulfilled' && Array.isArray(ipca.value) && ipca.value[0]) {
          state.bcb.ipca = ipca.value[0];
          bcbOk = true;
        }
        if (usd.status === 'fulfilled' && Array.isArray(usd.value) && usd.value[0]) {
          state.bcb.usdBrl = usd.value[0];
          bcbOk = true;
        }
        if (bcbOk) {
          state.bcb.status = 'ok';
          okCount++;
        }
      }),

      // 3. IBGE Localidades (224 municípios PI), Projeção População e Notícias IBGE
      Promise.allSettled([
        fetchJsonSafe('https://servicodados.ibge.gov.br/api/v1/localidades/estados/22/municipios'),
        fetchJsonSafe('https://servicodados.ibge.gov.br/api/v1/projecoes/populacao/BR'),
        fetchJsonSafe('https://servicodados.ibge.gov.br/api/v3/noticias/?busca=piaui&qtd=5')
      ]).then(results => {
        const [muns, proj, news] = results;
        let ibgeOk = false;
        if (muns.status === 'fulfilled' && Array.isArray(muns.value) && muns.value.length) {
          state.ibge.municipiosCount = muns.value.length;
          state.ibge.municipios = muns.value.map(m => ({ id: String(m.id), nome: m.nome }));
          ibgeOk = true;
        }
        if (proj.status === 'fulfilled' && proj.value && proj.value.projecao) {
          state.ibge.populacaoBrasilProjecao = proj.value.projecao.populacao;
          ibgeOk = true;
        }
        if (news.status === 'fulfilled' && news.value && Array.isArray(news.value.items)) {
          state.ibge.noticias = news.value.items
            .filter(item => typeof item.link === 'string' && /^https:\/\//.test(item.link))
            .slice(0, 5)
            .map(item => ({
              title: item.titulo,
              date: item.data_publicacao,
              url: item.link
            }));
          ibgeOk = true;
        }
        if (ibgeOk) {
          state.ibge.status = 'ok';
          okCount++;
        }
      }),

      // 4. Tesouro Nacional SICONFI (Estado do Piauí - id_ente=22)
      fetchJsonSafe(
        'https://apidatalake.tesouro.gov.br/ords/siconfi/tt/rgf?an_exercicio=2025&in_periodicidade=Q&nr_periodo=3&co_tipo_demonstrativo=RGF&no_anexo=RGF-Anexo%2001&co_esfera=E&co_poder=E&id_ente=22',
        7000
      ).then(data => {
        if (data && Array.isArray(data.items) && data.items.length) {
          state.siconfi = { status: 'ok', exercicio: 2025, periodo: 3, itens: data.items.length };
          okCount++;
        }
      }),

      // 5. Índice de Commodities Brasil (BCB SGS IC-Br 27574–27577) + Câmbio AwesomeAPI fallback
      Promise.allSettled([
        fetchJsonSafe('https://api.bcb.gov.br/dados/serie/bcdata.sgs.27574/dados/ultimos/1?formato=json'),
        fetchJsonSafe('https://api.bcb.gov.br/dados/serie/bcdata.sgs.27575/dados/ultimos/1?formato=json'),
        fetchJsonSafe('https://api.bcb.gov.br/dados/serie/bcdata.sgs.27576/dados/ultimos/1?formato=json'),
        fetchJsonSafe('https://api.bcb.gov.br/dados/serie/bcdata.sgs.27577/dados/ultimos/1?formato=json'),
        fetchJsonSafe('https://economia.awesomeapi.com.br/json/last/USD-BRL')
      ]).then(results => {
        const [tot, agro, met, ener, fx] = results;
        let commOk = false;
        if (tot.status === 'fulfilled' && Array.isArray(tot.value) && tot.value[0]) {
          state.commodities.icbr.total = tot.value[0]; commOk = true;
        }
        if (agro.status === 'fulfilled' && Array.isArray(agro.value) && agro.value[0]) {
          state.commodities.icbr.agro = agro.value[0]; commOk = true;
        }
        if (met.status === 'fulfilled' && Array.isArray(met.value) && met.value[0]) {
          state.commodities.icbr.metal = met.value[0]; commOk = true;
        }
        if (ener.status === 'fulfilled' && Array.isArray(ener.value) && ener.value[0]) {
          state.commodities.icbr.energia = ener.value[0]; commOk = true;
        }
        if (fx.status === 'fulfilled' && fx.value && fx.value.USDBRL && !state.bcb.usdBrl) {
          state.bcb.usdBrl = { data: 'ao vivo', valor: fx.value.USDBRL.bid };
          state.bcb.status = 'ok';
        }
        if (commOk) {
          state.commodities.status = 'ok';
        }
      })
    ];

    await Promise.allSettled(tasks);
    state.lastSync = formatTimeBR();
    if (okCount >= 3) {
      state.status = 'online';
      state.modeLabel = 'AO VIVO · GOV-BR APIs';
    } else if (okCount > 0) {
      state.status = 'partial';
      state.modeLabel = 'PARCIAL · GOV-BR + LOCAL';
    } else if (snapLoaded) {
      state.status = 'partial';
      state.modeLabel = 'SNAPSHOT OSINT · LOCAL';
    } else {
      state.status = 'offline';
      state.modeLabel = 'BASE LOCAL (SEM REDE)';
    }

    syncing = false;
    notify();
    return getState();
  }

  function initRealtimeGov() {
    if (initialized) return;
    initialized = true;
    renderLiveBar();
    const syncBtn = $('#govSyncNow');
    if (syncBtn) {
      syncBtn.addEventListener('click', () => {
        syncAll();
      });
    }
    if (typeof window.fetch === 'function') {
      syncAll();
    }
  }

  window.PiauiRealtime = {
    init: initRealtimeGov,
    syncAll,
    getState,
    onUpdate(fn) {
      if (typeof fn === 'function') listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRealtimeGov, { once: true });
  } else {
    initRealtimeGov();
  }
})();
