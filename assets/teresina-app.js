(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const normalize = str => String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  let favorites = new Set();
  let onlyFavorites = false;
  let eyeMounted = false;
  let chartsBuilt = false;

  const STORAGE_KEY = 'teresina_capital_favs_v1';

  function loadFavorites() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) favorites = new Set(saved);
    } catch (_) {
      favorites = new Set();
    }
  }

  function saveFavorites() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
    } catch (_) { /* noop */ }
  }

  function setupClock() {
    const tick = () => {
      const now = new Date();
      const opts = { timeZone: 'America/Fortaleza' };
      const t = now.toLocaleTimeString('pt-BR', opts);
      const d = now.toLocaleDateString('pt-BR', opts);
      if ($('#clockTime')) $('#clockTime').textContent = t;
      if ($('#navTime')) $('#navTime').textContent = t;
      if ($('#clockDate')) $('#clockDate').textContent = d;
    };
    tick();
    setInterval(tick, 1000);
  }

  function setupTabs() {
    const buttons = $$('#tabNav .tab-btn');
    const panels = $$('.tab-content');
    const activate = tabId => {
      buttons.forEach(btn => {
        const active = btn.dataset.tab === tabId;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      panels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabId}`);
      });
      if (tabId === 'eye-of-god' && !eyeMounted && typeof window.mountEyeOfGod === 'function') {
        const host = $('#eyeOfGodRoot');
        if (host && !host.querySelector('#eog-hud-shell')) {
          window.mountEyeOfGod(host, 'tab');
        }
        eyeMounted = true;
      }
      document.dispatchEvent(new CustomEvent('dashboard:tabchange', { detail: tabId }));
      if (!chartsBuilt) buildCharts();
    };
    buttons.forEach(btn => {
      btn.addEventListener('click', () => activate(btn.dataset.tab));
    });
  }

  function setupCardsAndFavorites() {
    loadFavorites();
    const cards = $$('.kpi-card, .detail-card');
    cards.forEach((card, idx) => {
      const id = card.dataset.cardId || `the-card-${idx}`;
      card.dataset.cardId = id;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card-fav';
      btn.setAttribute('aria-label', 'Favoritar indicador de Teresina');
      const syncBtn = () => {
        const fav = favorites.has(id);
        btn.textContent = fav ? '★' : '☆';
        btn.classList.toggle('is-fav', fav);
        card.classList.toggle('is-favorite', fav);
      };
      syncBtn();
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (favorites.has(id)) favorites.delete(id);
        else favorites.add(id);
        saveFavorites();
        syncBtn();
        applyFilters();
      });
      card.append(btn);
    });
    const favBtn = $('#toggleFavoritesBtn');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        onlyFavorites = !onlyFavorites;
        favBtn.classList.toggle('active', onlyFavorites);
        applyFilters();
      });
    }
  }

  function applyFilters() {
    const input = $('#dashboardSearch');
    const q = normalize((input?.value || '').trim());
    const cards = $$('.kpi-card, .detail-card, .swot-card, .anomaly-card');
    let visible = 0;
    cards.forEach(card => {
      const matchText = !q || normalize(card.textContent).includes(q);
      const matchFav = !onlyFavorites || card.classList.contains('is-favorite');
      const show = matchText && matchFav;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if ($('#favCount')) $('#favCount').textContent = String(favorites.size);
    if ($('#searchCount')) {
      $('#searchCount').textContent = q || onlyFavorites ? `${visible} cards visíveis` : '14 abas disponíveis';
    }
    if ($('#resetSearchBtn')) $('#resetSearchBtn').hidden = !q && !onlyFavorites;
    if ($('#searchEmpty')) $('#searchEmpty').hidden = visible > 0 || (!q && !onlyFavorites);
    if ($('#searchEmptyTerm')) $('#searchEmptyTerm').textContent = input?.value || '';
  }

  function setupSearchAndExport() {
    const input = $('#dashboardSearch');
    const resetBtn = $('#resetSearchBtn');
    if (input) input.addEventListener('input', applyFilters);
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (input) input.value = '';
        onlyFavorites = false;
        $('#toggleFavoritesBtn')?.classList.remove('active');
        applyFilters();
      });
    }

    const exportBtn = $('#exportDataBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const ont = window.PIAUI_ONTOLOGY || {};
        const payload = {
          exportedAt: new Date().toISOString(),
          edition: 'Teresina Capital (IBGE 2211001)',
          teresinaCapital: ont.teresinaCapital || null,
          schoolsInTeresina: (ont.schoolsCatalog || []).filter(s => s.municipality === 'Teresina'),
          securitySeries: (ont.publicSecurity && ont.publicSecurity.teresinaSeries) || [],
          realtime: window.PiauiRealtime ? window.PiauiRealtime.getState() : null
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `teresina-capital-analytics-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    }
  }

  function renderZonesAndNeighborhoods() {
    const ont = window.PIAUI_ONTOLOGY;
    const cap = ont && ont.teresinaCapital;
    if (!cap || !Array.isArray(cap.zonesUrban2022)) return;

    const zonesGrid = $('#theZonesGrid');
    if (zonesGrid) {
      zonesGrid.replaceChildren();
      cap.zonesUrban2022.forEach(z => {
        const growthStr = `${z.growth2010_22 >= 0 ? '+' : ''}${z.growth2010_22.toFixed(2).replace('.', ',')}% (2010–22)`;
        const card = document.createElement('article');
        card.className = 'mun-card';
        const st = document.createElement('strong');
        st.textContent = `${z.zone} · ${z.pop2022.toLocaleString('pt-BR')} hab.`;
        const sp = document.createElement('span');
        sp.textContent = `${growthStr} · ${z.neighborhoods ? `${z.neighborhoods} bairros` : 'Subdistrito histórico'}`;
        const sm = document.createElement('small');
        sm.textContent = `Favelas: ${z.favelasPop.toLocaleString('pt-BR')} hab. · ${z.highlight}`;
        card.append(st, sp, sm);
        zonesGrid.append(card);
      });
    }

    const body = $('#theNeighborhoodsBody');
    if (body) {
      body.replaceChildren();
      cap.zonesUrban2022.forEach(z => {
        const growthStr = `${z.growth2010_22 >= 0 ? '+' : ''}${z.growth2010_22.toFixed(2).replace('.', ',')}%`;
        const tr = document.createElement('tr');
        [
          z.zone,
          z.pop2022.toLocaleString('pt-BR'),
          growthStr,
          z.neighborhoods ? String(z.neighborhoods) : 'Central',
          z.favelasPop.toLocaleString('pt-BR'),
          z.highlight
        ].forEach(txt => {
          const td = document.createElement('td');
          td.textContent = txt;
          tr.append(td);
        });
        body.append(tr);
      });
    }
  }

  function renderFiscalSimulator() {
    const recEl = $('#theSimRec');
    const folhaEl = $('#theSimFolha');
    if (!recEl || !folhaEl) return;

    const update = () => {
      const r = Number(recEl.value);
      const f = Number(folhaEl.value);
      if ($('#theSimRecVal')) $('#theSimRecVal').textContent = `${r >= 0 ? '+' : ''}${r.toFixed(1).replace('.', ',')}%`;
      if ($('#theSimFolhaVal')) $('#theSimFolhaVal').textContent = `+${f.toFixed(1).replace('.', ',')}%`;

      const rec2027 = 5.668 * Math.pow(1 + r / 100, 2);
      const baseFolha = 2.75 * Math.pow(1 + f / 100, 2);
      const rclShare = (baseFolha / rec2027) * 100;
      const capexMi = Math.max(80, Math.round((rec2027 - baseFolha - 2.38) * 1000));

      if ($('#theSimRecOut')) $('#theSimRecOut').textContent = `R$ ${rec2027.toFixed(2).replace('.', ',')} bi`;
      if ($('#theSimFolhaOut')) $('#theSimFolhaOut').textContent = `${rclShare.toFixed(1).replace('.', ',')}%`;
      if ($('#theSimCapexOut')) $('#theSimCapexOut').textContent = `R$ ${capexMi} mi/ano`;

      const badge = $('#theSimBadge');
      const sum = $('#theSimSummary');
      if (badge && sum) {
        if (rclShare >= 54) {
          badge.dataset.risk = 'critical';
          badge.textContent = 'ACIMA TETO LRF (54%)';
          sum.textContent = 'Risco de extrapolação do limite máximo municipal da LRF (54%), travando operações de crédito e novas obras.';
        } else if (rclShare >= 51.3) {
          badge.dataset.risk = 'warn';
          badge.textContent = 'LIMITE PRUDENCIAL';
          sum.textContent = 'Acima do limite prudencial (51,3%); requer contenção de horas extras e reforço na cobrança de ISS/IPTU.';
        } else {
          badge.dataset.risk = 'ok';
          badge.textContent = 'EQUILÍBRIO LRF';
          sum.textContent = `Cenário sustentável abaixo dos limites da LRF, preservando ~R$ ${capexMi} mi/ano para VLT, drenagem e saúde.`;
        }
      }
    };

    [recEl, folhaEl].forEach(el => el.addEventListener('input', update));
    update();
  }

  function renderSchoolsExplorer() {
    const ont = window.PIAUI_ONTOLOGY;
    const grid = $('#theSchoolsGrid');
    if (!ont || !Array.isArray(ont.schoolsCatalog) || !grid) return;

    const teresinaSchools = ont.schoolsCatalog.filter(s => s.municipality === 'Teresina');
    const searchEl = $('#theSchoolsSearch');
    const zoneEl = $('#theSchoolsZone');
    const netEl = $('#theSchoolsNet');

    const draw = () => {
      const q = normalize((searchEl?.value || '').trim());
      const z = zoneEl ? zoneEl.value : '';
      const n = netEl ? netEl.value : '';
      const list = teresinaSchools.filter(s => {
        if (z && s.zone !== z) return false;
        if (n && s.network !== n) return false;
        if (q && !normalize(`${s.name} ${s.neighborhood} ${s.zone} ${s.inep} ${s.courses || ''}`).includes(q)) return false;
        return true;
      });

      if ($('#theSchoolsCountPill')) $('#theSchoolsCountPill').textContent = `${list.length} de ${teresinaSchools.length} unidades`;
      grid.replaceChildren();
      list.forEach(s => {
        const card = document.createElement('article');
        card.className = 'edu-school-card';
        const top = document.createElement('div');
        top.className = 'edu-school-top';
        const badge = document.createElement('span');
        badge.className = 'edu-net-badge';
        badge.dataset.net = s.network;
        badge.textContent = `${s.network} · Zona ${s.zone}`;
        const inep = document.createElement('span');
        inep.className = 'edu-inep';
        inep.textContent = `INEP ${s.inep}`;
        top.append(badge, inep);

        const title = document.createElement('h4');
        title.textContent = s.name;
        const meta = document.createElement('p');
        meta.className = 'edu-school-meta';
        meta.textContent = `${s.neighborhood} · ${s.students ?? '—'} matrículas · ${s.teachers ?? '—'} docentes`;

        const foot = document.createElement('div');
        foot.className = 'edu-school-foot';
        const ideb = document.createElement('span');
        ideb.textContent = s.idebEm != null ? `IDEB EM ${s.idebEm}` : (s.idebEf != null ? `IDEB EF ${s.idebEf}` : (s.courses || 'INEP'));
        const link = document.createElement('a');
        link.href = `https://qedu.org.br/escola/${encodeURIComponent(s.inep)}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Ficha INEP ↗';
        foot.append(ideb, link);

        card.append(top, title, meta, foot);
        grid.append(card);
      });
    };

    [searchEl, zoneEl, netEl].forEach(el => {
      if (el) el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', draw);
    });
    draw();
  }

  function renderSecurityAndEdtech() {
    const ont = window.PIAUI_ONTOLOGY;
    if (!ont) return;

    const secBody = $('#theSecTableBody');
    if (secBody && ont.publicSecurity && Array.isArray(ont.publicSecurity.teresinaSeries)) {
      secBody.replaceChildren();
      ont.publicSecurity.teresinaSeries.forEach(r => {
        const tr = document.createElement('tr');
        [
          r.metric,
          r.y2022 != null ? r.y2022.toLocaleString('pt-BR') : '—',
          r.y2025 != null ? r.y2025.toLocaleString('pt-BR') : '—',
          r.y2026 != null ? r.y2026.toLocaleString('pt-BR') : '—',
          r.dropVs2022Pct != null ? `${r.dropVs2022Pct.toFixed(2).replace('.', ',')}%` : '—',
          r.dropVs2025Pct != null ? `${r.dropVs2025Pct.toFixed(2).replace('.', ',')}%` : '—'
        ].forEach(txt => {
          const td = document.createElement('td');
          td.textContent = txt;
          tr.append(td);
        });
        secBody.append(tr);
      });
    }

    const edGrid = $('#theEdtechGrid');
    if (edGrid && ont.edtechEcosystem && Array.isArray(ont.edtechEcosystem.initiatives)) {
      edGrid.replaceChildren();
      ont.edtechEcosystem.initiatives.forEach(item => {
        const card = document.createElement('article');
        card.className = 'award-card';
        const b = document.createElement('span'); b.className = 'award-badge'; b.textContent = item.badge;
        const h = document.createElement('h4'); h.textContent = item.title;
        const s = document.createElement('span'); s.className = 'award-scope'; s.textContent = `${item.scope} · Impacto ${item.impactScore}/100`;
        const p = document.createElement('p'); p.textContent = item.detail;
        card.append(b, h, s, p);
        edGrid.append(card);
      });
    }
  }

  function renderSwotAndAnomalies() {
    const ont = window.PIAUI_ONTOLOGY;
    const cap = ont && ont.teresinaCapital;
    if (!cap) return;

    const swotGrid = $('#theSwotGrid');
    if (swotGrid && cap.swotTeresina) {
      swotGrid.replaceChildren();
      const blocks = [
        { cls: 'strengths', title: 'FORÇAS (TERESINA)', items: cap.swotTeresina.strengths },
        { cls: 'weaknesses', title: 'FRAQUEZAS (TERESINA)', items: cap.swotTeresina.weaknesses },
        { cls: 'opportunities', title: 'OPORTUNIDADES (TERESINA)', items: cap.swotTeresina.opportunities },
        { cls: 'threats', title: 'AMEAÇAS (TERESINA)', items: cap.swotTeresina.threats }
      ];
      blocks.forEach(b => {
        const card = document.createElement('div');
        card.className = `swot-card ${b.cls}`;
        const h = document.createElement('h4');
        h.textContent = b.title;
        card.append(h);
        (b.items || []).forEach(txt => {
          const item = document.createElement('div');
          item.className = 'swot-item';
          item.textContent = txt;
          card.append(item);
        });
        swotGrid.append(card);
      });
    }

    const anomGrid = $('#theAnomaliesGrid');
    if (anomGrid) {
      const items = [
        { severity: 'warn', title: 'Despovoamento do Centro (-23.066 hab.) vs Expansão Sul (+16,0%)', detail: 'Subdistrito Centro caiu de 118.923 (2010) para 95.857 (2022) enquanto Sul e Leste absorveram o crescimento imobiliário e habitacional.' },
        { severity: 'crit', title: 'Gap Água (97%) vs Esgotamento Sanitário (39%)', detail: 'Universalização da coleta e tratamento de esgoto é o maior passivo urbano de Teresina frente à média esperada para capitais.' },
        { severity: 'ok', title: 'Liderança IDEB NE (6,4 / 5,8) × Desafio Pós-Pandemia na Periferia', detail: 'Rede SEMEC atingiu o 1º lugar entre capitais nordestinas, exigindo reforço em creches e alfabetização nas 170 favelas urbanas.' },
        { severity: 'info', title: 'Alta dependência de serviços (82%) & Transição Digital (PIT / SoberanIA)', detail: 'Capital concentra 45,9% das novas vagas formais do PI (+9.646) e aposta no PIT para elevar renda média acima de serviços tradicionais.' }
      ];
      anomGrid.replaceChildren();
      items.forEach(it => {
        const card = document.createElement('article');
        card.className = `anomaly-card sev-${it.severity}`;
        const h = document.createElement('h4'); h.textContent = it.title;
        const p = document.createElement('p'); p.textContent = it.detail;
        card.append(h, p);
        anomGrid.append(card);
      });
    }
  }

  function renderCamerasAndNews() {
    const camGrid = $('#theCamerasGrid');
    const camSearch = $('#theCamSearch');
    const cams = Array.isArray(window.SPIA_CAMERAS) ? window.SPIA_CAMERAS : [];

    const drawCams = () => {
      if (!camGrid) return;
      const q = normalize((camSearch?.value || '').trim());
      const list = cams.filter(c => !q || normalize(`${c.title} ${c.place} ${c.type} ${c.id}`).includes(q));
      if ($('#theCamCount')) $('#theCamCount').textContent = `${list.length} câmeras listadas`;
      camGrid.replaceChildren();
      list.forEach(c => {
        const card = document.createElement('article');
        card.className = 'spia-card';
        const thumb = document.createElement('div');
        thumb.className = 'spia-thumb';
        const img = document.createElement('img');
        img.src = `https://i.ytimg.com/vi/${encodeURIComponent(c.id)}/hqdefault.jpg`;
        img.alt = c.title;
        img.loading = 'lazy';
        thumb.append(img);

        const body = document.createElement('div');
        body.className = 'spia-body';
        const t = document.createElement('h4'); t.textContent = c.title;
        const loc = document.createElement('p'); loc.textContent = `${c.place} · Tipo: ${c.type}`;
        const link = document.createElement('a');
        link.href = `https://www.youtube.com/watch?v=${encodeURIComponent(c.id)}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Abrir feed ↗';
        body.append(t, loc, link);
        card.append(thumb, body);
        camGrid.append(card);
      });
    };
    if (camSearch) camSearch.addEventListener('input', drawCams);
    drawCams();

    const newsList = $('#theNewsList');
    const newsSearch = $('#theNewsSearch');
    const newsCat = $('#theNewsCategory');
    const drawNews = () => {
      if (!newsList) return;
      const rt = window.PiauiRealtime ? window.PiauiRealtime.getState() : null;
      const liveItems = (rt && Array.isArray(rt.rssFeed) ? rt.rssFeed : [])
        .concat(rt && Array.isArray(rt.ibgeNews) ? rt.ibgeNews : []);
      const curated = Array.isArray(window.PIAUI_NEWS) ? window.PIAUI_NEWS : [];
      const eduArch = (window.PIAUI_ONTOLOGY && Array.isArray(window.PIAUI_ONTOLOGY.educationNewsArchive)) ? window.PIAUI_ONTOLOGY.educationNewsArchive : [];

      const seen = new Map();
      [...liveItems, ...eduArch, ...curated].forEach(it => {
        if (it && it.url && !seen.has(it.url)) seen.set(it.url, it);
      });

      const q = normalize((newsSearch?.value || '').trim());
      const c = newsCat ? newsCat.value : '';
      const list = [...seen.values()].filter(it => {
        if (c && it.category !== c) return false;
        if (q && !normalize(`${it.title} ${it.source} ${it.category}`).includes(q)) return false;
        return true;
      }).slice(0, 40);

      newsList.replaceChildren();
      list.forEach(item => {
        const a = document.createElement('a');
        a.className = 'news-item';
        a.href = item.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        const wrap = document.createElement('div');
        const h = document.createElement('h4'); h.textContent = item.title;
        const meta = document.createElement('span');
        meta.className = 'news-meta';
        meta.textContent = `${item.category || 'Geral'} · ${item.source || 'OSINT'} · ${item.date || ''}`;
        wrap.append(h, meta);
        const arrow = document.createElement('span');
        arrow.className = 'news-arrow';
        arrow.textContent = '↗';
        a.append(wrap, arrow);
        newsList.append(a);
      });
    };
    if (newsSearch) newsSearch.addEventListener('input', drawNews);
    if (newsCat) newsCat.addEventListener('change', drawNews);
    document.addEventListener('piaui:realtime-update', drawNews);
    drawNews();
  }

  function syncRealtimeBanner() {
    const update = () => {
      const rt = window.PiauiRealtime ? window.PiauiRealtime.getState() : null;
      if (!rt) return;
      if (rt.weather && rt.weather.tempC != null) {
        const tempStr = `${rt.weather.tempC}°C`;
        if ($('#theClockTemp')) $('#theClockTemp').textContent = tempStr;
        if ($('#rtWeatherVal')) $('#rtWeatherVal').textContent = `${tempStr} · ${rt.weather.humidityPct ?? '—'}% UR`;
        if ($('#rtWeatherSub')) $('#rtWeatherSub').textContent = `Vento ${rt.weather.windKmh ?? '—'} km/h · Teresina Live`;
      }
      if (rt.bcb) {
        const parts = [];
        if (rt.bcb.selic != null) parts.push(`Selic ${rt.bcb.selic}%`);
        if (rt.bcb.usdBrl != null) parts.push(`USD R$ ${Number(rt.bcb.usdBrl).toFixed(2)}`);
        if (parts.length && $('#rtMacroVal')) $('#rtMacroVal').textContent = parts.join(' · ');
      }
      if (rt.siconfiTeresina && rt.siconfiTeresina.receitaBi) {
        const v = `R$ ${Number(rt.siconfiTeresina.receitaBi).toFixed(2).replace('.', ',')} bi`;
        if ($('#theSiconfiVal')) $('#theSiconfiVal').textContent = `${v} (${rt.siconfiTeresina.year || '2024'})`;
        if ($('#theEcoSiconfiCard')) $('#theEcoSiconfiCard').textContent = v;
      }
      if ($('#rtLastSync')) {
        $('#rtLastSync').textContent = rt.modeLabel ? `${rt.modeLabel} · ${rt.lastSync ? new Date(rt.lastSync).toLocaleTimeString('pt-BR') : ''}` : 'Base estruturada';
      }
    };
    document.addEventListener('piaui:realtime-update', update);
    if ($('#rtRefreshBtn')) {
      $('#rtRefreshBtn').addEventListener('click', () => {
        window.PiauiRealtime?.syncAll?.();
      });
    }
    update();
  }

  function createTheChart(id, config) {
    const el = document.getElementById(id);
    if (!el || typeof window.Chart !== 'function') return null;
    try {
      return new window.Chart(el, config);
    } catch (_) {
      return null;
    }
  }

  function buildCharts() {
    if (chartsBuilt || typeof window.Chart !== 'function') return;
    chartsBuilt = true;
    window.Chart.defaults.color = '#8899aa';
    window.Chart.defaults.borderColor = 'rgba(0,255,65,0.08)';

    createTheChart('chartTheOverviewPop', {
      type: 'line',
      data: {
        labels: ['1991', '2000', '2010', '2022', '2025 (Est.)'],
        datasets: [{
          label: 'População de Teresina (mil hab.)',
          data: [599.2, 715.4, 814.2, 866.3, 905.7],
          borderColor: '#00ff41',
          backgroundColor: 'rgba(0,255,65,0.14)',
          fill: true,
          tension: 0.35
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    createTheChart('chartTheOverviewBudget', {
      type: 'doughnut',
      data: {
        labels: ['Educação (SEMEC + Fundeb)', 'Saúde (FMS / SUS)', 'Infraestrutura, VLT & Urbanismo', 'Administração & Previdência'],
        datasets: [{
          data: [1.58, 1.44, 1.18, 1.47],
          backgroundColor: ['rgba(0,255,65,0.75)', 'rgba(0,240,255,0.75)', 'rgba(255,215,0,0.75)', 'rgba(255,140,0,0.75)']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    createTheChart('chartTheZonasPop', {
      type: 'bar',
      data: {
        labels: ['Sul', 'Leste', 'Norte', 'Sudeste', 'Centro'],
        datasets: [
          { label: 'População Total 2022', data: [195228, 192168, 189523, 134752, 95857], backgroundColor: 'rgba(0,240,255,0.6)', borderColor: '#00f0ff', borderWidth: 1 },
          { label: 'Em Favelas/Comunidades', data: [47523, 56583, 55830, 24685, 11812], backgroundColor: 'rgba(255,215,0,0.65)', borderColor: '#ffd700', borderWidth: 1 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    createTheChart('chartTheCentralidade', {
      type: 'radar',
      data: {
        labels: ['Saúde Complexidade', 'Educação Superior', 'Serviços & Comércio', 'Emprego Formal Caged', 'Inovação & IA', 'Logística Multimodal'],
        datasets: [{
          label: 'Centralidade Metropolitana THE (0–100)',
          data: [96, 94, 92, 90, 86, 78],
          borderColor: '#00f0ff',
          backgroundColor: 'rgba(0,240,255,0.2)'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { r: { min: 0, max: 100 } } }
    });

    createTheChart('chartTheDemoZonas', {
      type: 'bar',
      data: {
        labels: ['Sul', 'Leste', 'Norte', 'Sudeste', 'Centro'],
        datasets: [
          { label: 'Censo 2010', data: [168280, 167465, 178760, 134120, 118923], backgroundColor: 'rgba(136,153,170,0.5)' },
          { label: 'Censo 2022', data: [195228, 192168, 189523, 134752, 95857], backgroundColor: 'rgba(0,255,65,0.65)' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    createTheChart('chartTheEcoPib', {
      type: 'doughnut',
      data: {
        labels: ['Serviços & Comércio', 'Administração Pública', 'Indústria & Construção', 'Agropecuária'],
        datasets: [{ data: [58, 24, 17, 1], backgroundColor: ['#00ff41', '#00f0ff', '#ffd700', '#ff8c00'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    createTheChart('chartTheEcoLoa', {
      type: 'bar',
      data: {
        labels: ['Educação', 'Saúde', 'Urbanismo/Transp.', 'Previdência/Encargos', 'Segurança/Assistência'],
        datasets: [{ label: 'LOA 2025 Estimada (R$ bi)', data: [1.58, 1.44, 1.18, 0.92, 0.55], backgroundColor: 'rgba(0,255,65,0.65)', borderColor: '#00ff41', borderWidth: 1 }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    createTheChart('chartTheEduEtapas', {
      type: 'bar',
      data: {
        labels: ['Ed. Infantil', 'Fund. Iniciais', 'Fund. Finais', 'Ensino Médio', 'EJA'],
        datasets: [{ label: 'Matrículas Públicas THE 2026 (mil)', data: [24.4, 38.4, 31.0, 22.0, 10.9], backgroundColor: 'rgba(0,240,255,0.65)', borderColor: '#00f0ff', borderWidth: 1 }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    createTheChart('chartTheSecQueda', {
      type: 'bar',
      data: {
        labels: ['CVLI', 'Homicídios', 'Roubo Geral (÷100)', 'Roubo Celular (÷100)', 'Roubo Arma (÷100)'],
        datasets: [
          { label: 'Jan–Mai 2022', data: [115, 108, 66.9, 46.4, 46.0], backgroundColor: 'rgba(255,59,48,0.6)' },
          { label: 'Jan–Mai 2025', data: [89, 84, 38.0, 25.3, 24.8], backgroundColor: 'rgba(255,215,0,0.6)' },
          { label: 'Jan–Mai 2026', data: [55, 54, 22.4, 12.0, 11.6], backgroundColor: 'rgba(0,255,65,0.7)' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    createTheChart('chartTheEdtechHub', {
      type: 'bar',
      data: {
        labels: ['Piauí IA (Capital)', 'PIT Superior IA', 'SoberanIA Cloud', 'Seduckathon', 'Escola Tech Capital'],
        datasets: [{ label: 'Índice de Maturidade Hub THE (0–100)', data: [98, 92, 90, 95, 86], backgroundColor: 'rgba(0,240,255,0.65)' }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }
    });

    createTheChart('chartTheIdhmComp', {
      type: 'bar',
      data: {
        labels: ['IDHM Geral', 'Longevidade', 'Renda', 'Educação'],
        datasets: [
          { label: 'Teresina Capital', data: [0.751, 0.820, 0.731, 0.707], backgroundColor: 'rgba(0,255,65,0.7)' },
          { label: 'Média Piauí', data: [0.646, 0.777, 0.547, 0.547], backgroundColor: 'rgba(0,240,255,0.55)' },
          { label: 'Média Brasil', data: [0.727, 0.816, 0.739, 0.637], backgroundColor: 'rgba(255,215,0,0.55)' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0.4, max: 0.9 } } }
    });
  }

  function init() {
    setupClock();
    setupTabs();
    setupCardsAndFavorites();
    setupSearchAndExport();
    applyFilters();
    renderZonesAndNeighborhoods();
    renderFiscalSimulator();
    renderSchoolsExplorer();
    renderSecurityAndEdtech();
    renderSwotAndAnomalies();
    renderCamerasAndNews();
    syncRealtimeBanner();
    buildCharts();
    setTimeout(buildCharts, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
