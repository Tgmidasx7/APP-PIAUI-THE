/* Indicadores locais; notícias consultam RSS por serviço externo e vídeos usam YouTube. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const clean = text => text.replace(/\s+/g, ' ').trim();
  const storageKey = 'pi-analytics-favorites-v1';
  let favorites = new Set();
  let cards = [];
  let searchEntries = [];
  let tabs = [];
  let initialized = false;

  function readFavorites() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(stored)) favorites = new Set(stored.filter(item => typeof item === 'string'));
    } catch (_) { favorites = new Set(); }
  }

  function writeFavorites() {
    try { localStorage.setItem(storageKey, JSON.stringify([...favorites])); return true; }
    catch (_) { return false; }
  }

  function selectTab(name, focus = false, updateUrl = true) {
    const button = tabs.find(tab => tab.dataset.tab === name);
    if (!button) return false;
    tabs.forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById('tab-' + tab.dataset.tab).classList.toggle('active', active);
    });
    document.dispatchEvent(new CustomEvent('dashboard:tabchange', { detail: name }));
    if (focus) button.focus();
    if (updateUrl) {
      try { history.replaceState(null, '', '#' + name); } catch (_) { /* file:// or restricted browser */ }
    }
    requestAnimationFrame(() => {
      (window.chartRecords || []).forEach(record => {
        if (record.chart && record.canvas.closest('.tab-content.active')) record.chart.resize();
      });
    });
    return true;
  }

  function goToCard(card) {
    selectTab(card.tab);
    requestAnimationFrame(() => {
      card.element.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      const button = $('.favorite-toggle', card.element);
      if (button) button.focus({ preventScroll: true });
    });
  }

  function setupTabs() {
    tabs = $$('.tab-btn');
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab.dataset.tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        selectTab(tabs[next].dataset.tab, true);
      });
    });
    $$('[data-open-tab]').forEach(button => button.addEventListener('click', () => {
      selectTab(button.dataset.openTab);
      $('#tabNav').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    const hash = location.hash.slice(1);
    if (hash) selectTab(hash, false, false);
    window.addEventListener('hashchange', () => selectTab(location.hash.slice(1), false, false));
  }

  function setupCards() {
    cards = $$('.tab-content .kpi-card').map((element, index) => {
      const panel = element.closest('.tab-content');
      const tab = panel.id.slice(4);
      const label = clean($('.kpi-label', element)?.textContent || 'Indicador');
      const value = clean($('.kpi-value', element)?.textContent || '');
      const context = clean($('.kpi-sub', element)?.textContent || '');
      const tabName = clean(tabs.find(item => item.dataset.tab === tab)?.textContent || tab);
      const id = tab + ':' + label;
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'favorite-toggle';
      button.addEventListener('click', () => {
        if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
        const saved = writeFavorites();
        renderFavorites();
        if (!saved) $('#favoritesStatus').textContent = 'Não foi possível salvar neste navegador; os favoritos valem apenas nesta sessão.';
      });
      element.append(button);
      return { id, element, tab, tabName, label, value, context, button, index };
    });
  }

  function renderFavorites() {
    const list = $('#favoritesList');
    list.replaceChildren();
    cards.forEach(card => {
      const isSaved = favorites.has(card.id);
      card.button.textContent = isSaved ? '★' : '☆';
      card.button.setAttribute('aria-pressed', String(isSaved));
      card.button.setAttribute('aria-label', (isSaved ? 'Remover dos favoritos: ' : 'Adicionar aos favoritos: ') + card.label);
    });
    const savedCards = cards.filter(card => favorites.has(card.id));
    if (!savedCards.length) {
      const empty = document.createElement('span'); empty.className = 'empty-favorites';
      empty.textContent = 'Marque uma estrela nos indicadores para acompanhar aqui.'; list.append(empty);
      return;
    }
    savedCards.forEach(card => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'favorite-link';
      button.textContent = '★ ' + card.label + ' · ' + card.value;
      button.addEventListener('click', () => goToCard(card)); list.append(button);
    });
  }

  function setupSearch() {
    // Além dos cartões, indexa os detalhes e itens SWOT já presentes no painel.
    const details = $$('.tab-content .data-row, .tab-content .swot-item').map(element => {
      const tab = element.closest('.tab-content').id.slice(4);
      const tabName = clean(tabs.find(item => item.dataset.tab === tab)?.textContent || tab);
      const label = clean($('.data-label', element)?.textContent || element.textContent);
      const value = clean($('.data-value', element)?.textContent || '');
      const context = clean(element.closest('.detail-card, .swot-card')?.querySelector('h3, h4')?.textContent || '');
      return { element, tab, tabName, label, value, context };
    });
    searchEntries = [...cards, ...details];
    const input = $('#dashboardSearch'), results = $('#searchResults');
    input.addEventListener('input', () => {
      const query = normalize(input.value.trim()); results.replaceChildren();
      results.hidden = !query;
      if (!query) return;
      const words = query.split(/\s+/);
      const matches = searchEntries.filter(card => words.every(word => normalize([card.label, card.value, card.context, card.tabName].join(' ')).includes(word)));
      const status = document.createElement('p');
      status.textContent = matches.length ? `${matches.length} indicador(es) encontrado(s)` : 'Nenhum indicador encontrado. Tente outro termo.';
      results.append(status);
      matches.forEach(card => {
        const button = document.createElement('button'); button.type = 'button';
        button.textContent = card.label + (card.value ? ' — ' + card.value : '');
        const detail = document.createElement('small'); detail.textContent = card.tabName + (card.context ? ' · ' + card.context : '');
        button.append(detail); button.addEventListener('click', () => goToCard(card)); results.append(button);
      });
    });
    document.addEventListener('keydown', event => {
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
        event.preventDefault(); input.focus();
      }
      if (event.key === 'Escape' && document.activeElement === input) { input.value = ''; input.dispatchEvent(new Event('input')); }
    });
  }

  function setupExport() {
    $('#exportCsv').addEventListener('click', () => {
      // Prefixa fórmulas para que valores abertos em planilhas sejam tratados como texto.
      const quote = value => {
        let text = String(value ?? '');
        if (/^[\s]*[=+\-@\t\r]/.test(text)) text = "'" + text;
        return '"' + text.replace(/"/g, '""') + '"';
      };
      const rows = [['Seção', 'Indicador', 'Valor exibido', 'Contexto exibido', 'Observação'], ...cards.map(card => [card.tabName, card.label, card.value, card.context, 'Indicador auditado em assets/ontology.js; fonte primária listada em Fontes'])];
      const content = '\ufeff' + rows.map(row => row.map(quote).join(';')).join('\r\n');
      const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'indicadores-piaui-teresina.csv';
      document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    const dossierBtn = $('#exportDossier');
    if (dossierBtn) {
      dossierBtn.addEventListener('click', () => {
        const payload = {
          generatedAt: new Date().toISOString(),
          timezone: 'America/Fortaleza',
          ontology: window.PIAUI_ONTOLOGY || null,
          realtime: window.PiauiRealtime ? window.PiauiRealtime.getState() : null,
          favorites: [...favorites],
          kpis: cards.map(c => ({ tab: c.tabName, label: c.label, value: c.value, context: c.context }))
        };
        const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }));
        const link = document.createElement('a'); link.href = url; link.download = 'dossie-piaui-analytics-v2.json';
        document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    }
    $('#printPage').addEventListener('click', () => window.print());
  }

  function setupCharts() {
    (window.chartRecords || []).forEach(({ canvas, config, chart }) => {
      const container = canvas.closest('.chart-container');
      const title = clean($('h3', container)?.textContent || 'Gráfico');
      canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', title + '. Dados disponíveis na tabela abaixo.');
      if (!chart) {
        const fallback = document.createElement('p'); fallback.className = 'chart-fallback';
        fallback.textContent = 'Gráfico indisponível. Consulte os valores na tabela abaixo.';
        canvas.parentElement.replaceChildren(fallback);
      }
      const details = document.createElement('details'); details.className = 'chart-data';
      if (!chart) details.open = true;
      const summary = document.createElement('summary'); summary.textContent = 'Ver dados do gráfico em tabela'; details.append(summary);
      const wrapper = document.createElement('div'); wrapper.className = 'chart-table-wrap';
      const table = document.createElement('table');
      const caption = document.createElement('caption'); caption.textContent = title + ' — valores presentes no painel, sujeitos a verificação'; table.append(caption);
      const head = document.createElement('thead'), headerRow = document.createElement('tr');
      ['Categoria', ...config.data.datasets.map((dataset, index) => dataset.label || `Série ${index + 1}`)].forEach(value => {
        const th = document.createElement('th'); th.scope = 'col'; th.textContent = value; headerRow.append(th);
      });
      head.append(headerRow); table.append(head);
      const body = document.createElement('tbody');
      (config.data.labels || []).forEach((label, index) => {
        const row = document.createElement('tr'); const heading = document.createElement('th'); heading.scope = 'row'; heading.textContent = label; row.append(heading);
        config.data.datasets.forEach(dataset => { const td = document.createElement('td'); td.textContent = dataset.data[index] == null ? '—' : String(dataset.data[index]); row.append(td); });
        body.append(row);
      });
      table.append(body); wrapper.append(table); details.append(wrapper); container.append(details);
      const note = chartNotes[canvas.id];
      if (note) {
        const context = document.createElement('p'); context.className = 'chart-context';
        const label = document.createElement('strong'); label.textContent = 'Como ler: ';
        const source = document.createElement('a'); source.href = note[1]; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Consultar portal de referência ↗';
        context.append(label, document.createTextNode(note[0] + ' '), source); container.append(context);
      }
    });
  }

  function setupSpia() {
    const grid = $('#spiaGrid'), search = $('#spiaSearch'), count = $('#spiaCount');
    const buttons = $$('[data-spia-filter]');
    let filterType = 'todas';
    let activeCard = null;
    const records = (window.SPIA_CAMERAS || []).filter(item => /^[A-Za-z0-9_-]{11}$/.test(item.id));
    const cards = records.map((item, i) => {
      const card = document.createElement('article'); card.className = 'spia-camera';
      const screen = document.createElement('div'); screen.className = 'camera-screen';
      const trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'camera-trigger';
      trigger.setAttribute('aria-label', `Reproduzir vídeo público: ${item.title}, ${item.place}`);
      const image = document.createElement('img'); image.src = `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`; image.alt = ''; image.loading = 'lazy'; image.referrerPolicy = 'no-referrer'; image.addEventListener('error', () => image.remove());
      const overlay = document.createElement('span'); overlay.className = 'camera-play'; overlay.textContent = '▶'; overlay.setAttribute('aria-hidden', 'true');
      const screenLabel = document.createElement('span'); screenLabel.className = 'camera-screen-label'; screenLabel.textContent = 'VÍDEO PÚBLICO • ABRIR';
      trigger.append(image, overlay, screenLabel); screen.append(trigger);
      const caption = document.createElement('div'); caption.className = 'camera-caption';
      const wrap = document.createElement('div'); const h = document.createElement('h4'); h.textContent = item.title;
      const loc = document.createElement('p'); loc.textContent = item.place + ' • ' + (item.type === 'aeroporto' ? 'Aeroporto' : 'Cidade');
      const link = document.createElement('a'); link.href = `https://www.youtube.com/watch?v=${item.id}`; link.textContent = 'Canal / vídeo original ↗'; link.target = '_blank'; link.rel = 'noopener noreferrer';
      const serial = document.createElement('span'); serial.textContent = String(i + 1).padStart(2, '0');
      wrap.append(h, loc, link); caption.append(wrap, serial); card.append(screen, caption); grid.append(card);
      function stop() { screen.replaceChildren(trigger); }
      trigger.addEventListener('click', () => {
        if (activeCard) activeCard.stop();
        const frame = document.createElement('iframe'); frame.src = `https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&mute=1&playsinline=1`;
        frame.title = `Vídeo público: ${item.title}, ${item.place}`; frame.allow = 'autoplay; encrypted-media; picture-in-picture'; frame.allowFullscreen = true;
        const close = document.createElement('button'); close.type = 'button'; close.className = 'camera-close'; close.textContent = 'Fechar vídeo';
        close.addEventListener('click', () => { stop(); activeCard = null; trigger.focus(); });
        screen.replaceChildren(frame, close); activeCard = {stop, card};
      });
      return { item, card };
    });
    function filter() {
      let visible = 0; const query = normalize(search.value.trim());
      cards.forEach(({ item, card }) => {
        const show = (filterType === 'todas' || filterType === item.type) && normalize(`${item.title} ${item.place}`).includes(query);
        card.hidden = !show; if (show) visible++;
      });
      if (activeCard && activeCard.card.hidden) { activeCard.stop(); activeCard = null; }
      count.textContent = `${visible} de ${cards.length} telas`;
    }
    buttons.forEach(button => button.addEventListener('click', () => {
      filterType = button.dataset.spiaFilter; buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button))); filter();
    }));
    search.addEventListener('input', filter); filter();
    document.addEventListener('dashboard:tabchange', event => { if (event.detail !== 'spia' && activeCard) { activeCard.stop(); activeCard = null; } });
    const scenarios = {
      norte: ['Exemplo fictício: uma via da Zona Norte apresenta movimento de veículos. Um operador poderia conferir a situação antes de qualquer decisão.', 'Exemplo fictício: uma imagem hipotética da Zona Norte está com visibilidade reduzida. Seria necessário verificar a fonte original.'],
      sul: ['Exemplo fictício: na Zona Sul, uma via imaginária mostra fluxo alternado. Não há dados reais sendo observados.', 'Exemplo fictício: a simulação sugere revisar uma imagem hipotética da Zona Sul. Nenhuma ocorrência foi detectada.'],
      leste: ['Exemplo fictício: na Zona Leste, uma central poderia registrar a condição geral de uma via, sempre mediante conferência humana.', 'Exemplo fictício: o exemplo representa uma tela hipotética da Zona Leste sem identificar pessoas ou veículos.'],
      sudeste: ['Exemplo fictício: no Sudeste de Teresina, uma via imaginária é descrita como movimentada. Isso não é uma medição.', 'Exemplo fictício: uma central poderia revisar uma tela hipotética na região Sudeste. Não há vídeo real associado.'],
      centro: ['Exemplo fictício: no Centro, uma observação hipotética mencionaria circulação em uma via. O exemplo não descreve o momento atual.', 'Exemplo fictício: para o Centro, o sistema sugere uma verificação humana de uma imagem imaginária. Não é um alerta real.']
    };
    let scenarioIndex = 0;
    $('#spiaSimulate').addEventListener('click', () => { const choices = scenarios[$('#spiaScenario').value]; $('#spiaOutput').textContent = choices[scenarioIndex++ % choices.length]; });
  }

  function setupNews() {
    const input = $('#newsSearch'), category = $('#newsCategory'), list = $('#newsList');
    const terminal = $('#terminalBox'), counter = $('#newsCounter'), pause = $('#newsPause'), status = $('#newsStatus');
    const sources = [
      {name:'g1 Piauí', feed:'https://g1.globo.com/rss/g1/pi/piaui/', host:'g1.globo.com'},
      {name:'Governo do Piauí', feed:'https://www.pi.gov.br/feed/', host:'www.pi.gov.br'}
    ];
    const local = window.PIAUI_NEWS || [];
    const fetched = new Map();
    let items = [], filtered = [], index = 0, refreshing = false, started = false;
    let paused = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const updatePause = () => { pause.setAttribute('aria-pressed', String(paused)); pause.textContent = paused ? '▶ Retomar' : 'Ⅱ Pausar'; };
    const fmt = date => { const [y,m,d] = date.split('-'); return `${d}/${m}/${y}`; };
    const dateKey = date => {
      const parts = new Intl.DateTimeFormat('en-US', {timeZone:'America/Fortaleza', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(date);
      const get = type => parts.find(part => part.type === type).value;
      return `${get('year')}-${get('month')}-${get('day')}`;
    };
    function rebuild() {
      const now = new Date(), startDate = new Date(now.getTime()); startDate.setUTCFullYear(startDate.getUTCFullYear() - 1);
      const start = dateKey(startDate), end = dateKey(now), unique = new Map();
      const rt = window.PiauiRealtime ? window.PiauiRealtime.getState() : null;
      const snapshot = rt && Array.isArray(rt.snapshotNews) ? rt.snapshotNews : [];
      const ibgeNews = rt && rt.ibge && Array.isArray(rt.ibge.noticias)
        ? rt.ibge.noticias.map(n => ({ date: String(n.date || end).slice(0, 10), title: n.title, url: n.url, source: 'Agência IBGE', category: 'Estatísticas', feed: true }))
        : [];
      const pool = [...fetched.values()].flat().concat(snapshot, ibgeNews, local);
      pool.forEach(item => {
        if (item.date >= start && item.date <= end && /^https:\/\//.test(item.url) && !unique.has(item.url)) unique.set(item.url, item);
      });
      if (!unique.size) {
        pool.forEach(item => {
          if (/^https:\/\//.test(item.url) && !unique.has(item.url)) unique.set(item.url, item);
        });
      }
      items = [...unique.values()].sort((a, b) => b.date.localeCompare(a.date));
      const selected = category.value;
      category.replaceChildren(new Option('Todos os assuntos', ''));
      [...new Set(items.map(item => item.category))].sort((a, b) => a.localeCompare(b, 'pt-BR')).forEach(name => category.add(new Option(name, name)));
      if ([...category.options].some(option => option.value === selected)) category.value = selected;
      filter(false);
    }
    function writeLine() {
      if (!filtered.length) { terminal.textContent = 'Nenhuma notícia nesta seleção. Altere os filtros ou consulte as fontes originais.'; counter.textContent = '0 resultados'; return; }
      if (!terminal.querySelector('.cmd-line')) terminal.replaceChildren();
      const item = filtered[index];
      const atBottom = terminal.scrollHeight - terminal.clientHeight - terminal.scrollTop < 45;
      const line = document.createElement('div'); line.className = 'cmd-line';
      const prompt = document.createElement('span'); prompt.className = 'news-prompt'; prompt.textContent = `piaui@noticias:~$ [${String(index + 1).padStart(2, '0')}] `;
      const link = document.createElement('a'); link.href = item.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = item.title + ' ↗';
      const meta = document.createElement('span'); meta.className = 'news-meta'; meta.textContent = `    └─ ${fmt(item.date)} · ${item.source} · ${item.category}${item.feed ? ' · FEED' : ' · ARQUIVO'}`;
      line.append(prompt, link, meta); terminal.append(line);
      while (terminal.children.length > 120) terminal.firstElementChild.remove();
      if (atBottom) terminal.scrollTop = terminal.scrollHeight;
      counter.textContent = `${index + 1} / ${filtered.length} · ROTACIONANDO`;
    }
    function renderList() {
      list.replaceChildren(); $('#archiveCount').textContent = `${filtered.length} notícia${filtered.length === 1 ? '' : 's'}`;
      if (!filtered.length) { const empty = document.createElement('p'); empty.className = 'news-note'; empty.textContent = 'Nenhuma notícia encontrada para os filtros selecionados.'; list.append(empty); return; }
      filtered.forEach(item => {
        const row = document.createElement('article'); row.className = 'news-item';
        const wrap = document.createElement('div'); const link = document.createElement('a'); link.href = item.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = item.title;
        const meta = document.createElement('small'); meta.textContent = `${fmt(item.date)} · ${item.source} · ${item.category}${item.feed ? ' · Feed' : ' · Arquivo'}`;
        const arrow = document.createElement('span'); arrow.className = 'news-arrow'; arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗';
        wrap.append(link, meta); row.append(wrap, arrow); list.append(row);
      });
    }
    function filter(clear = true) {
      const query = normalize(input.value.trim());
      filtered = items.filter(item => (!category.value || item.category === category.value) && normalize([item.title,item.source,item.category].join(' ')).includes(query));
      index = 0; renderList(); if (clear) terminal.replaceChildren(); writeLine();
    }
    async function fetchSource(source) {
      const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const endpoint = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(source.feed);
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json(); if (data.status !== 'ok' || !Array.isArray(data.items)) throw new Error('Feed indisponível');
        return data.items.flatMap(item => {
          try {
            const url = new URL(item.link); const published = new Date(item.pubDate.replace(' ', 'T') + (/[zZ]|[+-]\d\d:?\d\d$/.test(item.pubDate) ? '' : 'Z'));
            if (url.protocol !== 'https:' || url.hostname !== source.host || !Number.isFinite(published.getTime()) || typeof item.title !== 'string') return [];
            const title = new DOMParser().parseFromString(item.title, 'text/html').body.textContent.trim();
            return title ? [{date:dateKey(published), title, url:url.href, source:source.name, category:'Atualidades', feed:true}] : [];
          } catch (_) { return []; }
        });
      } finally { clearTimeout(timeout); }
    }
    async function refresh() {
      if (refreshing) return; started = true;
      if (typeof fetch !== 'function') { status.textContent = 'Consulta indisponível neste navegador. Mantendo curadoria local.'; return; }
      refreshing = true; status.textContent = 'Consultando os feeds via RSS2JSON…';
      const results = await Promise.allSettled(sources.map(fetchSource));
      const failed = [];
      results.forEach((result, i) => { if (result.status === 'fulfilled') fetched.set(sources[i].name, result.value); else failed.push(sources[i].name); });
      rebuild();
      const time = new Date().toLocaleTimeString('pt-BR', {timeZone:'America/Fortaleza', hour:'2-digit', minute:'2-digit'});
      status.textContent = failed.length === sources.length ? `Consulta às ${time}: feeds indisponíveis. Mantendo arquivo e última consulta bem-sucedida da sessão.` : failed.length ? `Consulta às ${time}: sem resposta de ${failed.join(', ')}. Outros feeds atualizados; mantendo dados anteriores quando houver.` : `Feeds consultados às ${time} (hora de Teresina). Próxima tentativa em 5 minutos.`;
      refreshing = false;
    }
    input.addEventListener('input', () => filter()); category.addEventListener('change', () => filter());
    $('#newsNext').addEventListener('click', () => { if (filtered.length) { index = (index + 1) % filtered.length; writeLine(); } });
    $('#newsPrev').addEventListener('click', () => { if (filtered.length) { index = (index - 1 + filtered.length) % filtered.length; writeLine(); } });
    $('#newsClear').addEventListener('click', () => { terminal.replaceChildren(); writeLine(); });
    $('#newsRefresh').addEventListener('click', refresh);
    pause.addEventListener('click', () => { paused = !paused; updatePause(); });
    setInterval(() => { if (!paused && filtered.length && !document.hidden && $('#tab-terminal').classList.contains('active')) { index = (index + 1) % filtered.length; writeLine(); } }, 5000);
    setInterval(() => { if (started) refresh(); }, 300000);
    document.addEventListener('dashboard:tabchange', event => { if (event.detail === 'terminal' && !started) refresh(); });
    document.addEventListener('piaui:realtime-update', () => rebuild());
    updatePause(); rebuild();
    if ($('#tab-terminal').classList.contains('active')) refresh();
  }

  const chartNotes = {
    chartPIBSetores: ['Distribuição setorial ilustrativa ponderada (Serviços 71,7%, Agropecuária 18,0%, Indústria 10,3% ≈ 100%) alinhada à matriz estadual; confira desagregação oficial das Contas Regionais IBGE.', 'https://www.ibge.gov.br/explica/pib.php'],
    chartPIBSetores2: ['Distribuição setorial ponderada do PIB estadual (Serviços 71,7%, Agropecuária 18,0%, Indústria 10,3%), separando composição de taxas anuais de crescimento.', 'https://www.ibge.gov.br/explica/pib.php'],
    chartIDH: ['Série estadual do IDH do Piauí (PNUD / Atlas Brasil) para 2000, 2010, 2020 e 2021, preservando a mesma metodologia estadual.', 'https://www.undp.org/pt/brazil'],
    chartIDH2: ['Série histórica do IDH do Estado do Piauí separada do marco de IDHM de Teresina (0,751 em 2010), evitando mistura direta de metodologias distintas.', 'https://www.undp.org/pt/brazil'],
    chartRelevo: ['Compartimentos geomorfológicos de referência no Piauí (planícies/baixadas, planaltos sedimentares e chapadas/serras do meio-norte e sudoeste).', 'https://www.ibge.gov.br/geociencias.html'],
    chartPopulacao: ['Contagem oficial do Censo Demográfico 2022 (3.271.199 hab.) e Estimativas IBGE 2024–2025 (3.384.547 hab.); taxa geométrica 2010–2022 (+0,26% a.a.) distinguida da variação recente de estimativas.', 'https://www.ibge.gov.br/cidades-e-estados/pi.html'],
    chartConcentracao: ['Proporção da população concentrada na Região Metropolitana / Grande Teresina e polos regionais versus demais municípios do Piauí (Censo 2022 / Est. 2025).', 'https://www.ibge.gov.br/cidades-e-estados/pi.html'],
    chartFinancas: ['Série homogênea de execução orçamentária de 2025 (SEFAZ-PI / RGF-SICONFI) em bilhões de reais: Receita Corrente Bruta (R$ 21,60 bi), RCL (R$ 19,50 bi), Despesa Corrente (R$ 18,19 bi) e DCL (R$ 10,93 bi).', 'https://www.gov.br/tesouronacional/pt-br'],
    chartIDEB: ['Notas oficiais do IDEB 2023 (INEP) por etapa de ensino (Anos Iniciais, Anos Finais e Ensino Médio) comparando Piauí, Brasil e média do Nordeste.', 'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb'],
    chartPosicaoEM: ['Ranking estadual do Piauí no IDEB Ensino Médio em 2021 e 2023 (escala invertida: 4ª posição em 2023 representa melhor colocação no Brasil e liderança no Nordeste).', 'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb'],
    chartGeoCorredores: ['Índices sintéticos ilustrativos (0–100) construídos a partir da síntese de ativos e gargalos logísticos de cada corredor geoeconômico do Piauí.', 'https://www.ibge.gov.br/cidades-e-estados/pi.html'],
    chartEcoVetores: ['Comparativo qualitativo-estrutural (0–100) entre o peso de cada motor econômico no Piauí e sua exposição direta a petróleo/diesel, dólar e clima.', 'https://www.bcb.gov.br/']
  };

  function setupClock() {
    const update = () => {
      const now = new Date(), options = { timeZone: 'America/Fortaleza' };
      $('#clockDate').textContent = now.toLocaleDateString('pt-BR', options);
      const time = now.toLocaleTimeString('pt-BR', options);
      $('#clockTime').textContent = time; $('#navTime').textContent = time;
      $('#clockTimestamp').textContent = String(Math.floor(now.getTime() / 1000));
    };
    update(); setInterval(update, 1000);
  }

  function setupIntelligenceV2() {
    const ontology = window.PIAUI_ONTOLOGY;
    if (!ontology) return;

    // 1. Detector de Anomalias & Divergências Auditadas
    const anomalyBox = $('#analyticsAnomalies');
    if (anomalyBox) {
      anomalyBox.replaceChildren();
      const severityLabels = { crit: 'CRÍTICA', warn: 'ATENÇÃO', ok: 'REGULAR', info: 'METODOLOGIA' };
      ontology.anomalies.forEach(item => {
        const card = document.createElement('article');
        card.className = 'anomaly-card';
        card.dataset.severity = item.severity === 'crit' ? 'high' : item.severity;
        const tag = document.createElement('span');
        tag.className = 'anomaly-tag';
        tag.textContent = `AUDITORIA · ${severityLabels[item.severity] || 'INFO'}`;
        const h = document.createElement('h4');
        h.textContent = item.title;
        const p = document.createElement('p');
        p.textContent = item.detail;
        const sm = document.createElement('small');
        sm.textContent = `Código: ${item.id} · Fonte: assets/ontology.js`;
        card.append(tag, h, p, sm);
        anomalyBox.append(card);
      });
    }

    // 2. Simulador Fiscal What-If LRF (2025-2030)
    const rclSlider = $('#simRclGrowth');
    const dclSlider = $('#simDclGrowth');
    const pibSlider = $('#simPibGrowth');
    const tableBody = $('#simTableBody');
    if (rclSlider && dclSlider && pibSlider && tableBody) {
      const updateSimulation = () => {
        const gRcl = Number(rclSlider.value) / 100;
        const gDcl = Number(dclSlider.value) / 100;
        const gPib = Number(pibSlider.value) / 100;
        if ($('#simRclVal')) $('#simRclVal').textContent = `${Number(rclSlider.value).toFixed(1)}% a.a.`;
        if ($('#simDclVal')) $('#simDclVal').textContent = `${Number(dclSlider.value).toFixed(1)}% a.a.`;
        if ($('#simPibVal')) $('#simPibVal').textContent = `${Number(pibSlider.value).toFixed(1)}% a.a.`;

        let rcl = ontology.baseline.receitaCorrente2025Bi;
        let dcl = ontology.baseline.dcl2025Bi;
        let pib = ontology.baseline.pibPI2023Bi * Math.pow(1 + gPib, 2); // Base 2025
        let ratio2030 = 0;

        tableBody.replaceChildren();
        for (let year = 2025; year <= 2030; year++) {
          if (year > 2025) {
            rcl *= (1 + gRcl);
            dcl *= (1 + gDcl);
            pib *= (1 + gPib);
          }
          const ratio = (dcl / rcl) * 100;
          if (year === 2030) ratio2030 = ratio;
          const tr = document.createElement('tr');
          [
            String(year),
            `R$ ${rcl.toFixed(2)} bi`,
            `R$ ${dcl.toFixed(2)} bi`,
            `${ratio.toFixed(1)}%`,
            `${((dcl / pib) * 100).toFixed(1)}%`,
            ratio >= 200 ? 'EXCEDE LRF (200%)' : ratio >= 120 ? 'ATENÇÃO LRF' : 'DENTRO DO LIMITE'
          ].forEach(val => {
            const td = document.createElement('td');
            td.textContent = val;
            tr.append(td);
          });
          tableBody.append(tr);
        }

        const badge = $('#simRiskBadge');
        const summary = $('#simSummary');
        if (badge) {
          if (ratio2030 >= 150) {
            badge.dataset.risk = 'critical';
            badge.textContent = `ALERTA LRF (${ratio2030.toFixed(1)}% em 2030)`;
          } else if (ratio2030 >= 100) {
            badge.dataset.risk = 'alert';
            badge.textContent = `ATENÇÃO FISCAL (${ratio2030.toFixed(1)}% em 2030)`;
          } else {
            badge.dataset.risk = 'ok';
            badge.textContent = `CONFORTO LRF (${ratio2030.toFixed(1)}% em 2030)`;
          }
        }
        if (summary) {
          summary.textContent = `Em 2030, a relação DCL/RCL projetada atinge ${ratio2030.toFixed(1)}% (Teto LRF Senado Federal: 200,0%).`;
        }
      };
      [rclSlider, dclSlider, pibSlider].forEach(el => el.addEventListener('input', updateSimulation));
      updateSimulation();
    }

    // 3. Explorador Territorial (16 Polos + 224 Municípios IBGE)
    const munSearch = $('#munSearch');
    const munGrid = $('#munGrid');
    const munCount = $('#munCount');
    if (munSearch && munGrid) {
      const renderMunicipalities = () => {
        const query = normalize(munSearch.value.trim());
        const rt = window.PiauiRealtime ? window.PiauiRealtime.getState() : null;
        const hubsById = new Map(ontology.municipalities.map(m => [
          String(m.ibge || m.id),
          {
            id: String(m.ibge || m.id),
            nome: m.name || m.nome,
            pop2022: m.pop2022,
            territory: m.territory,
            role: m.role
          }
        ]));
        const allItems = rt && rt.ibge && Array.isArray(rt.ibge.municipios) && rt.ibge.municipios.length
          ? rt.ibge.municipios.map(m => hubsById.get(String(m.id)) || {
              id: String(m.id),
              nome: m.nome,
              territory: 'Município oficial UF 22 (IBGE API)',
              role: 'Cadastro municipal ativo — consulta IBGE Localidades'
            })
          : [...hubsById.values()];

        const filteredMuns = allItems.filter(m =>
          !query || normalize(`${m.nome} ${m.id} ${m.territory || ''} ${m.role || ''}`).includes(query)
        );
        if (munCount) {
          munCount.textContent = `${filteredMuns.length} de ${allItems.length} municípios (${rt && rt.ibge && rt.ibge.municipios && rt.ibge.municipios.length ? 'Malha completa 224 IBGE' : '16 polos georreferenciados'})`;
        }
        munGrid.replaceChildren();
        filteredMuns.slice(0, 48).forEach(m => {
          const card = document.createElement('article');
          card.className = 'mun-card';
          const title = document.createElement('strong');
          title.textContent = m.nome;
          const meta = document.createElement('span');
          meta.textContent = m.pop2022
            ? `IBGE ${m.id} · Pop. ${m.pop2022.toLocaleString('pt-BR')} · ${m.territory}`
            : `IBGE ${m.id} · ${m.territory}`;
          const desc = document.createElement('small');
          desc.textContent = m.role || '';
          card.append(title, meta, desc);
          munGrid.append(card);
        });
      };
      munSearch.addEventListener('input', renderMunicipalities);
      document.addEventListener('piaui:realtime-update', renderMunicipalities);
      renderMunicipalities();
    }

    // 4. Matriz Auditada de Indicadores (Aba Fontes & Método)
    const invBody = $('#ontologyInventoryBody');
    const invCount = $('#inventoryCount');
    if (invBody && Array.isArray(ontology.indicators)) {
      invBody.replaceChildren();
      const statusMap = {
        oficial: 'OFICIAL',
        estimativa: 'ESTIMATIVA',
        auditado_painel: 'AUDITADO',
        a_verificar: 'EM REVISÃO'
      };
      ontology.indicators.forEach(ind => {
        const tr = document.createElement('tr');
        const tdDom = document.createElement('td'); tdDom.textContent = ind.domain;
        const tdLbl = document.createElement('td'); tdLbl.textContent = `${ind.label} (${ind.entity})`;
        const tdVal = document.createElement('td'); tdVal.textContent = ind.value;
        const tdPer = document.createElement('td'); tdPer.textContent = ind.period;
        const tdSt = document.createElement('td'); tdSt.textContent = statusMap[ind.status] || ind.status;
        const tdSrc = document.createElement('td');
        if (ind.sourceUrl && /^https:\/\//.test(ind.sourceUrl)) {
          const a = document.createElement('a');
          a.href = ind.sourceUrl; a.target = '_blank'; a.rel = 'noopener noreferrer';
          a.textContent = `${ind.sourceName} ↗`;
          tdSrc.append(a);
        } else {
          tdSrc.textContent = ind.sourceName || '—';
        }
        tr.append(tdDom, tdLbl, tdVal, tdPer, tdSt, tdSrc);
        invBody.append(tr);
      });
      if (invCount) invCount.textContent = `${ontology.indicators.length} indicadores estruturados`;
    }

    // 5. Painel Macro BCB & SICONFI ao Vivo (Aba Econômica)
    const renderEcoMacro = () => {
      const rt = window.PiauiRealtime ? window.PiauiRealtime.getState() : null;
      if (!rt) return;
      const elSelic = $('#ecoMacroSelic');
      const elIpca = $('#ecoMacroIpca');
      const elUsd = $('#ecoMacroUsd');
      const elSiconfi = $('#ecoMacroSiconfi');
      if (elSelic) elSelic.textContent = rt.bcb && rt.bcb.selic && rt.bcb.selic.valor != null ? `${rt.bcb.selic.valor}% a.a. (${rt.bcb.selic.data || 'atual'})` : 'Offline (última base local)';
      if (elIpca) elIpca.textContent = rt.bcb && rt.bcb.ipca && rt.bcb.ipca.valor != null ? `${rt.bcb.ipca.valor}% mês (${rt.bcb.ipca.data || 'atual'})` : 'Offline (última base local)';
      if (elUsd) elUsd.textContent = rt.bcb && rt.bcb.usdBrl && rt.bcb.usdBrl.valor != null ? `R$ ${Number(String(rt.bcb.usdBrl.valor).replace(',', '.')).toFixed(2)} (${rt.bcb.usdBrl.data || 'atual'})` : 'Offline (última base local)';
      if (elSiconfi) {
        elSiconfi.textContent = rt.siconfi && rt.siconfi.status === 'ok'
          ? `RGF ${rt.siconfi.exercicio} · ${rt.siconfi.itens} linhas (${rt.siconfi.periodo}º quad.)`
          : 'Base auditada SEFAZ-PI (56,1% RCL 2025)';
      }
    };
    document.addEventListener('piaui:realtime-update', renderEcoMacro);
    renderEcoMacro();

    // 6. Corredores Geoeconômicos & Matriz de Cruzamento (Aba Geopolítica)
    const corridorsBox = $('#geoPolCorridors');
    if (corridorsBox && Array.isArray(ontology.geoCorridors)) {
      corridorsBox.replaceChildren();
      ontology.geoCorridors.forEach(c => {
        const card = document.createElement('article');
        card.className = 'corridor-card';
        const tag = document.createElement('span');
        tag.className = 'cross-tag';
        tag.textContent = c.status;
        const h = document.createElement('h4');
        h.textContent = c.name;
        const meta = document.createElement('span');
        meta.className = 'corridor-meta';
        meta.textContent = `Foco: ${c.focus}`;
        const p = document.createElement('p');
        p.textContent = c.summary;

        const meters = document.createElement('div');
        meters.className = 'corridor-meters';
        [
          ['Potencial Estratégico', c.potentialScore, ''],
          ['Infraestrutura Atual', c.infraScore, 'infra']
        ].forEach(([lbl, val, cls]) => {
          const row = document.createElement('div');
          row.className = 'corridor-meter-row';
          const s1 = document.createElement('span'); s1.textContent = lbl;
          const s2 = document.createElement('span'); s2.textContent = `${val}/100`;
          row.append(s1, s2);
          const track = document.createElement('div');
          track.className = 'corridor-meter-track';
          const fill = document.createElement('div');
          fill.className = `corridor-meter-fill ${cls}`.trim();
          fill.style.width = `${Math.max(0, Math.min(100, Number(val) || 0))}%`;
          track.append(fill);
          meters.append(row, track);
        });

        card.append(tag, h, meta, p, meters);
        corridorsBox.append(card);
      });
    }

    const geoMatrixBody = $('#geoCrossMatrix');
    if (geoMatrixBody && Array.isArray(ontology.geoCrossMatrix)) {
      geoMatrixBody.replaceChildren();
      ontology.geoCrossMatrix.forEach(item => {
        const tr = document.createElement('tr');
        [item.shock, item.channel, item.effect, item.buffer].forEach(txt => {
          const td = document.createElement('td');
          td.textContent = txt;
          tr.append(td);
        });
        geoMatrixBody.append(tr);
      });
    }

    // 7. Cruzamentos Econômicos em Linguagem Acessível (Aba Econômica)
    const ecoCrossBox = $('#ecoCrossings');
    if (ecoCrossBox && Array.isArray(ontology.economicCrossings)) {
      ecoCrossBox.replaceChildren();
      ontology.economicCrossings.forEach(item => {
        const card = document.createElement('article');
        card.className = 'cross-card';
        const tag = document.createElement('span');
        tag.className = 'cross-tag';
        tag.textContent = item.tag;
        const h = document.createElement('h4');
        h.textContent = item.title;
        const p = document.createElement('p');
        p.textContent = item.plainText;
        card.append(tag, h, p);
        ecoCrossBox.append(card);
      });
    }

    // 8. Commodities, Petróleo, IC-Br (BCB) & Termômetro Interativo Piauí
    const commGrid = $('#commodityGrid');
    const commBadge = $('#commSourceBadge');
    const usdInput = $('#commUsdInput');
    const brentInput = $('#commBrentInput');
    const soyInput = $('#commSoyInput');
    let userEditedCommSim = false;

    const updateCommodityCalculator = () => {
      if (!usdInput || !brentInput || !soyInput) return;
      const usd = Number(usdInput.value);
      const brent = Number(brentInput.value);
      const soyBu = Number(soyInput.value);
      if ($('#commUsdLabel')) $('#commUsdLabel').textContent = `R$ ${usd.toFixed(2).replace('.', ',')}`;
      if ($('#commBrentLabel')) $('#commBrentLabel').textContent = `US$ ${brent.toFixed(2).replace('.', ',')}`;
      if ($('#commSoyLabel')) $('#commSoyLabel').textContent = `US$ ${soyBu.toFixed(2).replace('.', ',')}`;

      const brentBrl = brent * usd;
      const soySacaBrl = soyBu * 2.20462262 * usd;

      if ($('#commBrentBrlOut')) {
        $('#commBrentBrlOut').textContent = `R$ ${brentBrl.toFixed(2).replace('.', ',')} / bbl`;
      }
      if ($('#commDieselOut')) {
        $('#commDieselOut').textContent = brentBrl >= 480
          ? 'Alerta de frete caro: pressão elevada sobre caminhões no MATOPIBA e ônibus/cargas em Teresina.'
          : brentBrl >= 380
            ? 'Pressão moderada de diesel sobre as rodovias estaduais; ferrovia reduziria esse custo.'
            : 'Alívio logístico: petróleo em reais abaixo de R$ 380/barril reduz custo de transporte.';
      }
      if ($('#commSoySacaOut')) {
        $('#commSoySacaOut').textContent = `R$ ${soySacaBrl.toFixed(2).replace('.', ',')} / sc`;
      }
      if ($('#commBalanceOut') && $('#commSummaryOut')) {
        if (soySacaBrl >= 135 && brentBrl < 450) {
          $('#commBalanceOut').textContent = 'MARGEM AGRO FAVORÁVEL';
          $('#commSummaryOut').textContent = `Soja a R$ ${soySacaBrl.toFixed(0)}/sc com frete sob controle favorece Uruçuí e Bom Jesus.`;
        } else if (brentBrl >= 480 && soySacaBrl < 120) {
          $('#commBalanceOut').textContent = 'COMPRESSÃO DE MARGEM';
          $('#commSummaryOut').textContent = 'Diesel caro com soja pressionada reduz lucro líquido do produtor piauiense na estrada.';
        } else {
          $('#commBalanceOut').textContent = 'EQUILÍBRIO CONDICIONADO';
          $('#commSummaryOut').textContent = `Receita bruta da saca (~R$ ${soySacaBrl.toFixed(0)}) disputa espaço com custo de frete rodoviário (barril R$ ${brentBrl.toFixed(0)}).`;
        }
      }
    };

    if (usdInput && brentInput && soyInput) {
      [usdInput, brentInput, soyInput].forEach(el => el.addEventListener('input', () => {
        userEditedCommSim = true;
        updateCommodityCalculator();
      }));
      updateCommodityCalculator();
    }

    const renderCommodities = () => {
      const rt = window.PiauiRealtime ? window.PiauiRealtime.getState() : null;
      const comm = rt && rt.commodities ? rt.commodities : { icbr: {}, quotes: {} };
      const icbr = comm.icbr || {};
      const quotes = comm.quotes || {};
      const usdRaw = rt && rt.bcb && rt.bcb.usdBrl && rt.bcb.usdBrl.valor != null
        ? Number(String(rt.bcb.usdBrl.valor).replace(',', '.'))
        : null;
      const usdRate = Number.isFinite(usdRaw) && usdRaw > 0 ? usdRaw : null;

      const setIcbr = (id, obj) => {
        const el = $(id);
        if (el) el.textContent = obj && obj.valor != null ? `${obj.valor}` : 'Aguardando sync';
      };
      setIcbr('#icbrTotalVal', icbr.total);
      setIcbr('#icbrAgroVal', icbr.agro);
      setIcbr('#icbrEnerVal', icbr.energia);
      setIcbr('#icbrMetalVal', icbr.metal);
      if ($('#icbrTotalDate') && icbr.total && icbr.total.data) {
        $('#icbrTotalDate').textContent = `Ref. BCB: ${icbr.total.data}`;
      }

      const hasQuotes = Object.keys(quotes).length > 0;
      const hasIcbr = Object.values(icbr).some(Boolean);
      if (commBadge) {
        commBadge.dataset.state = (hasQuotes || hasIcbr) ? 'online' : 'baseline';
        commBadge.textContent = hasQuotes && hasIcbr
          ? 'AO VIVO (BCB IC-BR + OSINT)'
          : hasIcbr
            ? 'AO VIVO (BCB IC-BR) · SNAPSHOT PARCIAL'
            : hasQuotes
              ? 'OSINT MERCADO ATUALIZADO'
              : 'OFFLINE / AGUARDANDO SYNC OSINT';
      }

      if (!userEditedCommSim && usdInput && brentInput && soyInput) {
        let changed = false;
        if (usdRate) { usdInput.value = String(Math.min(7, Math.max(4.5, usdRate)).toFixed(2)); changed = true; }
        if (quotes.brent && typeof quotes.brent.price === 'number') {
          brentInput.value = String(Math.min(125, Math.max(45, Math.round(quotes.brent.price)))); changed = true;
        }
        if (quotes.soja && typeof quotes.soja.price === 'number') {
          soyInput.value = String(Math.min(16.5, Math.max(7.5, quotes.soja.price / 100)).toFixed(1)); changed = true;
        }
        if (changed) updateCommodityCalculator();
      }

      if (commGrid && Array.isArray(ontology.commoditiesMeta)) {
        commGrid.replaceChildren();
        ontology.commoditiesMeta.forEach(meta => {
          const q = quotes[meta.id] || null;
          const card = document.createElement('article');
          card.className = 'commodity-card';

          const top = document.createElement('div');
          top.className = 'commodity-card-top';
          const cat = document.createElement('span');
          cat.className = 'commodity-cat';
          cat.textContent = meta.category;
          const delta = document.createElement('span');
          delta.className = 'commodity-delta';
          if (q && typeof q.changePct === 'number') {
            delta.textContent = `${q.changePct >= 0 ? '+' : ''}${q.changePct.toFixed(2)}%`;
            if (q.changePct > 0) delta.classList.add('up');
            else if (q.changePct < 0) delta.classList.add('down');
          } else {
            delta.textContent = 'REF. OSINT';
          }
          top.append(cat, delta);

          const h = document.createElement('h4');
          h.textContent = meta.name;

          const priceEl = document.createElement('div');
          priceEl.className = 'commodity-price';
          const brlEl = document.createElement('div');
          brlEl.className = 'commodity-brl';

          if (q && typeof q.price === 'number') {
            if (meta.unit === 'USc/bushel') {
              const usdBu = q.price / 100;
              priceEl.textContent = `US$ ${usdBu.toFixed(2)} / bu`;
              if (usdRate) {
                const factor = meta.id === 'soja' ? 2.20462262 : 2.3620957;
                const scBrl = usdBu * factor * usdRate;
                brlEl.textContent = `≈ R$ ${scBrl.toFixed(2).replace('.', ',')} / saca 60 kg (USD ${usdRate.toFixed(2)})`;
              } else {
                brlEl.textContent = 'Conecte o câmbio BCB para converter em R$/saca 60 kg';
              }
            } else if (meta.id === 'brent' || meta.id === 'wti') {
              priceEl.textContent = `US$ ${q.price.toFixed(2)} / bbl`;
              brlEl.textContent = usdRate
                ? `≈ R$ ${(q.price * usdRate).toFixed(2).replace('.', ',')} / barril`
                : 'Aguardando câmbio para conversão em R$/barril';
            } else if (meta.id === 'ouro') {
              priceEl.textContent = `US$ ${q.price.toFixed(2)} / oz`;
              brlEl.textContent = usdRate
                ? `≈ R$ ${((q.price * usdRate) / 31.1034768).toFixed(2).replace('.', ',')} / grama`
                : 'Aguardando câmbio para R$/g';
            } else {
              priceEl.textContent = `US$ ${q.price.toFixed(2)} (${meta.unit})`;
              brlEl.textContent = `Ticker ${meta.symbol}`;
            }
          } else {
            priceEl.textContent = 'Aguardando sync';
            brlEl.textContent = `${meta.symbol} · ${meta.unit} (use o simulador ou sincronize OSINT)`;
          }

          const impact = document.createElement('p');
          impact.className = 'commodity-impact';
          impact.textContent = meta.piauiLink;

          card.append(top, h, priceEl, brlEl, impact);
          commGrid.append(card);
        });
      }
    };

    document.addEventListener('piaui:realtime-update', renderCommodities);
    renderCommodities();
  }

  window.initDashboard = function () {
    if (initialized) return; initialized = true;
    setupTabs(); readFavorites(); setupCards(); renderFavorites(); setupSearch(); setupExport(); setupCharts(); setupClock(); setupSpia(); setupNews(); setupIntelligenceV2();
  };
})();
