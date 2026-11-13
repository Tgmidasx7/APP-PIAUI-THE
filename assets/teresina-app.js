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
    if (!buttons.length) return;

    const activate = (tabId, { updateHash = false, focusBtn = false } = {}) => {
      const targetBtn = buttons.find(btn => btn.dataset.tab === tabId) || buttons[0];
      const activeId = targetBtn.dataset.tab;
      buttons.forEach(btn => {
        const active = btn.dataset.tab === activeId;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
        btn.tabIndex = active ? 0 : -1;
      });
      panels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${activeId}`);
      });
      if (updateHash) {
        try {
          history.replaceState(null, '', `#${activeId}`);
        } catch (_) { /* noop */ }
      }
      if (focusBtn) targetBtn.focus();
      if (activeId === 'eye-of-god' && !eyeMounted && typeof window.mountEyeOfGod === 'function') {
        const host = $('#eyeOfGodRoot');
        if (host && !host.querySelector('#eog-hud-shell')) {
          window.mountEyeOfGod(host, 'tab');
        }
        eyeMounted = true;
      }
      document.dispatchEvent(new CustomEvent('dashboard:tabchange', { detail: activeId }));
      if (!chartsBuilt) buildCharts();
    };

    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => activate(btn.dataset.tab, { updateHash: true }));
      btn.addEventListener('keydown', e => {
        let nextIdx = -1;
        if (e.key === 'ArrowRight') nextIdx = (idx + 1) % buttons.length;
        else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + buttons.length) % buttons.length;
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = buttons.length - 1;
        if (nextIdx >= 0) {
          e.preventDefault();
          activate(buttons[nextIdx].dataset.tab, { updateHash: true, focusBtn: true });
        }
      });
    });

    $$('[data-open-tab]').forEach(el => {
      el.addEventListener('click', () => {
        activate(el.dataset.openTab, { updateHash: true });
        const nav = $('#tabNav');
        if (nav && typeof nav.scrollIntoView === 'function') nav.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    const initialHash = (window.location.hash || '').replace('#', '').trim();
    if (initialHash && buttons.some(btn => btn.dataset.tab === initialHash)) {
      activate(initialHash);
    }
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

    const triggerDownload = (content, filename, type) => {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const csvBtn = $('#exportCsvBtn');
    if (csvBtn) {
      csvBtn.addEventListener('click', () => {
        const rows = [['Secao', 'Indicador', 'Valor', 'Detalhe']];
        $$('.tab-content .kpi-card').forEach(card => {
          const sec = card.closest('.tab-content')?.id || 'teresina';
          const lbl = card.querySelector('.kpi-label')?.textContent?.trim() || '';
          const val = card.querySelector('.kpi-value')?.textContent?.trim() || '';
          const sub = card.querySelector('.kpi-sub')?.textContent?.trim() || '';
          rows.push([sec, lbl, val, sub].map(cell => `"${String(cell).replace(/"/g, '""')}"`));
        });
        triggerDownload(rows.map(r => r.join(',')).join('\n'), `teresina-kpis-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8');
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
        triggerDownload(JSON.stringify(payload, null, 2), `teresina-capital-analytics-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
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

    const mobGrid = $('#theMobilityGrid');
    if (mobGrid && Array.isArray(cap.mobilityAndInfra)) {
      mobGrid.replaceChildren();
      cap.mobilityAndInfra.forEach(m => {
        const card = document.createElement('article');
        card.className = 'award-card';
        const b = document.createElement('span'); b.className = 'award-badge'; b.textContent = m.metric;
        const h = document.createElement('h4'); h.textContent = m.title;
        const p = document.createElement('p'); p.textContent = m.detail;
        card.append(b, h, p);
        mobGrid.append(card);
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

  function renderFiscalAndBudget() {
    const ont = window.PIAUI_ONTOLOGY;
    const budget = ont && ont.teresinaCapital && ont.teresinaCapital.budget;
    const strip = $('#theBudgetStrip');
    if (strip && budget && Array.isArray(budget.seriesReceitasCorrentes)) {
      strip.replaceChildren();
      budget.seriesReceitasCorrentes.forEach(row => {
        const box = document.createElement('div');
        box.className = 'edu-stat-box';
        const sp = document.createElement('span'); sp.textContent = `Receitas Correntes (${row.year})`;
        const st = document.createElement('strong'); st.textContent = `R$ ${row.valueBi.toFixed(3).replace('.', ',')} bi`;
        const sm = document.createElement('small'); sm.textContent = row.year === 2025 ? 'Projeção LOA 2025 (R$ 5,668 bi totais)' : 'Série realizada SICONFI / LDO';
        box.append(sp, st, sm);
        strip.append(box);
      });
    }

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

    const awardsGrid = $('#theEduAwardsGrid');
    if (awardsGrid && Array.isArray(ont.educationAwards)) {
      awardsGrid.replaceChildren();
      ont.educationAwards.forEach(aw => {
        const card = document.createElement('article');
        card.className = 'award-card';
        const b = document.createElement('span'); b.className = 'award-badge'; b.textContent = aw.badge;
        const h = document.createElement('h4'); h.textContent = aw.title;
        const sc = document.createElement('span'); sc.className = 'award-scope'; sc.textContent = aw.scope;
        const p = document.createElement('p'); p.textContent = aw.detail;
        card.append(b, h, sc, p);
        awardsGrid.append(card);
      });
    }
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

    const secPillars = $('#theSecPillarsGrid');
    if (secPillars && ont.publicSecurity && Array.isArray(ont.publicSecurity.pillars)) {
      secPillars.replaceChildren();
      ont.publicSecurity.pillars.forEach(p => {
        const card = document.createElement('article');
        card.className = 'cross-card';
        const tag = document.createElement('span'); tag.className = 'cross-tag'; tag.textContent = p.tag;
        const h = document.createElement('h4'); h.textContent = p.title;
        const desc = document.createElement('p'); desc.textContent = p.detail;
        card.append(tag, h, desc);
        secPillars.append(card);
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

    const edBase = $('#theEdSimBase');
    const edRate = $('#theEdSimRate');
    const updateEdSim = () => {
      if (!edBase || !edRate) return;
      const base = Number(edBase.value);
      const rate = Number(edRate.value);
      const talents = Math.round((base * rate) / 100);
      if ($('#theEdSimBaseVal')) $('#theEdSimBaseVal').textContent = base.toLocaleString('pt-BR');
      if ($('#theEdSimRateVal')) $('#theEdSimRateVal').textContent = `${rate}%`;
      if ($('#theEdSimTalents')) $('#theEdSimTalents').textContent = `${talents.toLocaleString('pt-BR')} jovens`;
      if ($('#theEdSimBadge') && $('#theEdSimImpact') && $('#theEdSimText')) {
        if (rate >= 18) {
          $('#theEdSimBadge').dataset.risk = 'ok';
          $('#theEdSimBadge').textContent = 'ACELERAÇÃO TECH';
          $('#theEdSimImpact').textContent = 'Exportação de Serviços TI';
          $('#theEdSimText').textContent = `Com ${talents.toLocaleString('pt-BR')} jovens na capital entrando em TI/IA, Teresina consolida hub nacional de GovTech e software.`;
        } else if (rate <= 7) {
          $('#theEdSimBadge').dataset.risk = 'critical';
          $('#theEdSimBadge').textContent = 'GARGALO DE RETENÇÃO';
          $('#theEdSimImpact').textContent = 'Demanda reprimida';
          $('#theEdSimText').textContent = 'Conversão baixa requer ampliação de vagas no PIT, bolsas tecnológicas e conexão direta com empresas locais.';
        } else {
          $('#theEdSimBadge').dataset.risk = 'ok';
          $('#theEdSimBadge').textContent = 'HUB ATIVO';
          $('#theEdSimImpact').textContent = 'PIT + GovTech + Empresas';
          $('#theEdSimText').textContent = `Fluxo consistente de ${talents.toLocaleString('pt-BR')} novos profissionais sustentando SoberanIA e startups em Teresina.`;
        }
      }
    };
    if (edBase && edRate) {
      [edBase, edRate].forEach(el => el.addEventListener('input', updateEdSim));
      updateEdSim();
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

    const swotCross = $('#theSwotCrossGrid');
    if (swotCross) {
      const items = [
        { tag: 'SO · OFENSIVA', title: 'Hub Saúde/Edu + PIT & SoberanIA', desc: 'Unir o 1º IDEB das capitais do NE (6,4/5,8), Selo Ouro (80,58%) e base universitária (>70 mil alunos) ao PIT e SoberanIA para escalar empregos de alto salário.' },
        { tag: 'WO · REFORÇO', title: 'Saneamento 39% + Metrô/VLT R$ 600M', desc: 'Acelerar universalização do esgotamento sanitário nas 170 comunidades e entregar o novo VLT ligando Grande Dirceu (Sudeste) ao Centro e Zona Sul.' },
        { tag: 'ST · DEFENSIVA', title: 'DataSSP/CellGuard + Requalificação Centro', desc: 'Usar a queda de -74% nos roubos de celulares e monitoramento SPIA para revitalizar a habitação e economia criativa no Centro Histórico (-23 mil hab.).' },
        { tag: 'WT · CONTINGÊNCIA', title: 'Arborização Urbana + Mitigação B-R-O BRÓ', desc: 'Expandir corredores verdes para além de 58,16% e ampliar cobertura médica preventiva contra estresse térmico extremo nos meses secos.' }
      ];
      swotCross.replaceChildren();
      items.forEach(it => {
        const card = document.createElement('article');
        card.className = 'cross-card';
        const tag = document.createElement('span'); tag.className = 'cross-tag'; tag.textContent = it.tag;
        const h = document.createElement('h4'); h.textContent = it.title;
        const p = document.createElement('p'); p.textContent = it.desc;
        card.append(tag, h, p);
        swotCross.append(card);
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

        const actions = document.createElement('div');
        actions.className = 'action-row';
        actions.style.marginTop = '0.45rem';

        const playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.className = 'tool-button camera-trigger';
        playBtn.textContent = '▶ Player';
        playBtn.addEventListener('click', () => {
          if (thumb.querySelector('iframe')) return;
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(c.id)}?autoplay=1&rel=0`;
          iframe.title = c.title;
          iframe.allow = 'autoplay; encrypted-media';
          iframe.allowFullscreen = true;
          iframe.style.width = '100%';
          iframe.style.height = '180px';
          iframe.style.border = '0';
          thumb.replaceChildren(iframe);
          playBtn.hidden = true;
          closeBtn.hidden = false;
        });

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'tool-button camera-close';
        closeBtn.textContent = '✕ Fechar';
        closeBtn.hidden = true;
        closeBtn.addEventListener('click', () => {
          thumb.replaceChildren(img);
          playBtn.hidden = false;
          closeBtn.hidden = true;
        });

        const link = document.createElement('a');
        link.href = `https://www.youtube.com/watch?v=${encodeURIComponent(c.id)}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'YouTube ↗';

        actions.append(playBtn, closeBtn, link);
        body.append(t, loc, actions);
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
      const liveItems = []
        .concat(rt && Array.isArray(rt.snapshotNews) ? rt.snapshotNews : [])
        .concat(rt && rt.education && Array.isArray(rt.education.rssSeduc) ? rt.education.rssSeduc : [])
        .concat(rt && rt.education && Array.isArray(rt.education.ibgeNoticias) ? rt.education.ibgeNoticias.map(n => ({ ...n, source: 'IBGE Educação', category: 'Educação' })) : [])
        .concat(rt && rt.ibge && Array.isArray(rt.ibge.noticias) ? rt.ibge.noticias.map(n => ({ ...n, source: 'IBGE', category: 'Economia' })) : []);
      const curated = Array.isArray(window.PIAUI_NEWS) ? window.PIAUI_NEWS : [];
      const eduArch = (window.PIAUI_ONTOLOGY && Array.isArray(window.PIAUI_ONTOLOGY.educationNewsArchive)) ? window.PIAUI_ONTOLOGY.educationNewsArchive.map(n => ({ ...n, category: 'Educação' })) : [];

      const seen = new Map();
      [...liveItems, ...eduArch, ...curated].forEach(it => {
        if (it && typeof it.url === 'string' && /^https:\/\//.test(it.url) && !seen.has(it.url)) {
          seen.set(it.url, it);
        }
      });

      const q = normalize((newsSearch?.value || '').trim());
      const c = newsCat ? newsCat.value : '';
      const list = [...seen.values()].filter(it => {
        if (c && it.category !== c) return false;
        if (q && !normalize(`${it.title} ${it.source} ${it.category}`).includes(q)) return false;
        return true;
      }).slice(0, 50);

      if ($('#theNewsCountPill')) $('#theNewsCountPill').textContent = `${list.length} registros`;
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

  function renderSourcesInventory() {
    const tbody = $('#theSourcesInventory');
    const ont = window.PIAUI_ONTOLOGY;
    const cap = ont && ont.teresinaCapital;
    if (!tbody || !cap) return;

    const rows = [
      ['População Censo 2022', `${cap.overview.pop2022.toLocaleString('pt-BR')} hab. (Est. 2025: ${cap.overview.pop2025.toLocaleString('pt-BR')})`, '2022 / 2025', 'IBGE Censo & Estimativas'],
      ['PIB Municipal & Per Capita', `R$ ${cap.overview.pib2023Bi} bi (R$ ${cap.overview.pibPerCapita2023.toLocaleString('pt-BR')} / hab.)`, '2023', 'IBGE / CEPRO-PI'],
      ['SICONFI Receita Bruta / LOA', 'R$ 5,397 bi (2024) · LOA 2025 R$ 5,668 bi', '2024–2025', 'Tesouro Nacional SICONFI 2211001'],
      ['Emprego Formal (Novo Caged)', `+${cap.overview.cagedNet2025.toLocaleString('pt-BR')} vagas (estoque ${cap.overview.cagedStock2025.toLocaleString('pt-BR')})`, '2025', 'MTE / Novo Caged'],
      ['IDEB Municipal & Alfabetização', '6,4 (AI) / 5,8 (AF) · ICA 80,58% (Selo Ouro)', '2023 / 2025', 'INEP / SEMEC-THE'],
      ['Segurança Pública Teresina', 'CVLI 55 (-52,17%) · Roubo celular 1.200 (-74,15%)', 'Jan–Mai 2022–2026', 'SSP-PI / DataSSP'],
      ['Saneamento & Favelas (2022)', 'Esgoto 39% · Arborização 58,16% · 170 favelas (198.189 hab.)', '2022', 'IBGE Censo 2022'],
      ['IDHM Teresina (PNUD/IPEA)', '0,751 (Renda 0,731 · Long. 0,820 · Educ. 0,707)', '2010 (ref. oficial)', 'PNUD / IPEA / FJP']
    ];

    tbody.replaceChildren();
    rows.forEach(r => {
      const tr = document.createElement('tr');
      r.forEach(txt => {
        const td = document.createElement('td');
        td.textContent = txt;
        tr.append(td);
      });
      tbody.append(tr);
    });
  }

  function syncRealtimeBanner() {
    const update = () => {
      const rt = window.PiauiRealtime ? window.PiauiRealtime.getState() : null;
      if (!rt) return;

      const t = rt.weather && rt.weather.teresina;
      if (t && t.tempC != null) {
        const tempStr = `${Number(t.tempC).toFixed(1)}°C`;
        if ($('#theClockTemp')) $('#theClockTemp').textContent = tempStr;
        if ($('#rtWeatherVal')) $('#rtWeatherVal').textContent = `${tempStr} · ${t.humidity ?? '—'}% UR`;
        if ($('#rtWeatherSub')) $('#rtWeatherSub').textContent = `Vento ${t.windKmh ?? '—'} km/h · UV ${t.uv ?? '—'} · Teresina Live`;
      }

      if (rt.bcb) {
        const parts = [];
        if (rt.bcb.selic && rt.bcb.selic.valor != null) parts.push(`Selic ${rt.bcb.selic.valor}%`);
        if (rt.bcb.ipca && rt.bcb.ipca.valor != null) parts.push(`IPCA ${rt.bcb.ipca.valor}%`);
        if (rt.bcb.usdBrl && rt.bcb.usdBrl.valor != null) {
          const usd = Number(String(rt.bcb.usdBrl.valor).replace(',', '.'));
          if (Number.isFinite(usd)) parts.push(`USD R$ ${usd.toFixed(2)}`);
        }
        if (parts.length && $('#rtMacroVal')) $('#rtMacroVal').textContent = parts.join(' · ');
      }

      if (rt.siconfiTeresina && rt.siconfiTeresina.status === 'ok') {
        if ($('#theSiconfiVal')) $('#theSiconfiVal').textContent = `RGF ${rt.siconfiTeresina.exercicio} (Ao Vivo)`;
        if ($('#theSiconfiSub')) $('#theSiconfiSub').textContent = `Prefeitura 2211001 · ${rt.siconfiTeresina.itens} linhas (${rt.siconfiTeresina.periodo}º quad.)`;
      }

      if ($('#rtLastSync')) {
        $('#rtLastSync').textContent = rt.modeLabel ? `${rt.modeLabel}${rt.lastSync ? ` · ${rt.lastSync}` : ''}` : 'Base estruturada';
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

  function attachChartTableFallback(canvas, config) {
    const container = canvas.closest('.chart-container');
    if (!container || container.querySelector('.chart-data')) return;
    const labels = (config.data && config.data.labels) || [];
    const datasets = (config.data && config.data.datasets) || [];
    if (!labels.length || !datasets.length) return;

    const details = document.createElement('details');
    details.className = 'chart-data';
    const summary = document.createElement('summary');
    summary.textContent = 'Ver tabela de dados deste gráfico';
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    const table = document.createElement('table');
    table.className = 'v2-table';

    const thead = document.createElement('thead');
    const hRow = document.createElement('tr');
    const th0 = document.createElement('th'); th0.textContent = 'Categoria';
    hRow.append(th0);
    datasets.forEach(ds => {
      const th = document.createElement('th');
      th.textContent = ds.label || 'Valor';
      hRow.append(th);
    });
    thead.append(hRow);

    const tbody = document.createElement('tbody');
    labels.forEach((lbl, idx) => {
      const tr = document.createElement('tr');
      const td0 = document.createElement('td'); td0.textContent = String(lbl);
      tr.append(td0);
      datasets.forEach(ds => {
        const td = document.createElement('td');
        const val = Array.isArray(ds.data) ? ds.data[idx] : '';
        td.textContent = val != null ? String(val) : '—';
        tr.append(td);
      });
      tbody.append(tr);
    });

    table.append(thead, tbody);
    wrap.append(table);
    details.append(summary, wrap);
    container.append(details);
  }

  function createTheChart(id, config) {
    const el = document.getElementById(id);
    if (!el) return null;
    attachChartTableFallback(el, config);
    if (typeof window.Chart !== 'function') return null;
    try {
      return new window.Chart(el, config);
    } catch (_) {
      return null;
    }
  }

  function buildCharts() {
    if (chartsBuilt) return;
    chartsBuilt = true;
    if (typeof window.Chart === 'function') {
      window.Chart.defaults.color = '#8899aa';
      window.Chart.defaults.borderColor = 'rgba(0,255,65,0.08)';
    }

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
          label: 'LOA 2025 (R$ bilhões)',
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
        datasets: [{ label: 'Participação VAB (%)', data: [58, 24, 17, 1], backgroundColor: ['#00ff41', '#00f0ff', '#ffd700', '#ff8c00'] }]
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
    renderFiscalAndBudget();
    renderSchoolsExplorer();
    renderSecurityAndEdtech();
    renderSwotAndAnomalies();
    renderCamerasAndNews();
    renderSourcesInventory();
    syncRealtimeBanner();
    buildCharts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
