/**
 * S.P.I.A. · EYE OF GOD // PALANTIR MATRIX & GIS ENGINE v2.0
 * Componente compartilhado entre a aba #tab-eye-of-god e /eyeofgod/.
 */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function safeCtx(canvas) {
    if (!canvas || typeof canvas.getContext !== 'function') return null;
    try {
      return canvas.getContext('2d');
    } catch (_) {
      return null;
    }
  }

  function buildHudMarkup(mode = 'tab') {
    const isStandalone = mode === 'standalone';
    const headingTag = isStandalone ? 'h1' : 'h2';
    const topNavAction = isStandalone
      ? '<a class="eog-btn eog-link-btn" href="../">← PAINEL PRINCIPAL</a>'
      : '<a class="eog-btn eog-link-btn" href="eyeofgod/">↗ TELA DEDICADA</a>';

    return `
      <div class="eog-hud-shell" id="eog-hud-shell">
        <canvas id="eog-matrix-rain-canvas" aria-hidden="true"></canvas>
        <div class="eog-crt-overlay" aria-hidden="true"></div>

        <!-- TOP HEADER BAR -->
        <header class="eog-header">
          <div class="eog-brand-zone">
            <div class="eog-god-eye-logo" aria-hidden="true">
              <div class="eog-iris-ring"></div>
              <div class="eog-pupil-core"></div>
            </div>
            <div>
              <${headingTag} class="eog-glitch-text">S.P.I.A. // EYE OF GOD</${headingTag}>
              <p class="eog-brand-sub">GIS TERESINA–PIAUÍ · ONTOLOGIA PALANTIR · TELEMETRIA GOV-BR v2.0</p>
            </div>
          </div>

          <div class="eog-header-status-grid">
            <div class="eog-stat-pill">
              <span class="eog-pill-label">FONTE GOV-BR:</span>
              <span class="eog-pill-value ok" id="eog-gov-source-tag">BASE LOCAL</span>
            </div>
            <div class="eog-stat-pill">
              <span class="eog-pill-label">SATELLITE LINK:</span>
              <span class="eog-pill-value ok" id="eog-sat-uplink">GEO-PI-01 [WGS84]</span>
            </div>
            <div class="eog-stat-pill">
              <span class="eog-pill-label">HASH KERNEL:</span>
              <span class="eog-pill-value" id="eog-kernel-hash">0x9F4C...B21</span>
            </div>
            <div class="eog-stat-pill">
              <span class="eog-pill-label">DEFCON ESTADUAL:</span>
              <span class="eog-pill-value warn" id="eog-defcon-status">NÍVEL 2 - ELEVADO</span>
            </div>
            <div class="eog-stat-pill">
              <span class="eog-pill-label">HORA TÁTICA (BRT):</span>
              <span class="eog-pill-value clock" id="eog-tactical-clock">00:00:00.000</span>
            </div>
          </div>

          <div class="eog-header-actions">
            ${topNavAction}
            <button type="button" class="eog-btn alert-btn" id="eog-lockdown-btn" aria-pressed="false">🚨 LOCKDOWN TOTAL</button>
            <button type="button" class="eog-btn" id="eog-audio-toggle" aria-pressed="true">🔊 AUDIO: ON</button>
          </div>
        </header>

        <!-- MAIN TACTICAL GRID -->
        <div class="eog-main-grid">
          <!-- COLUNA 1: TELEMETRIA REAL GOV-BR & AMBIENTE DO PIAUÍ -->
          <aside class="eog-panel-box" id="eog-panel-telemetry">
            <div class="eog-panel-title">
              <span>📡 TELEMETRIA PIAUÍ &amp; GOV-BR AO VIVO</span>
              <span class="eog-corner-code">LOC: -05.0892° / -42.8016°</span>
            </div>
            <div class="eog-panel-content">
              <div class="eog-telemetry-grid">
                <div class="eog-sensor-card">
                  <div class="eog-s-label">CLIMA TERESINA (OPEN-METEO)</div>
                  <div class="eog-s-val" id="eog-sensor-temp">MODO LOCAL</div>
                  <div class="eog-s-sub">Sensores públicos · America/Fortaleza</div>
                </div>
                <div class="eog-sensor-card">
                  <div class="eog-s-label">POPULAÇÃO PIAUÍ (IBGE)</div>
                  <div class="eog-s-val" id="eog-sensor-pop">3.384.547</div>
                  <div class="eog-s-sub">Censo 2022: 3.271.199 · Est. 2025</div>
                </div>
                <div class="eog-sensor-card">
                  <div class="eog-s-label">FISCAL / SELIC (BCB SGS)</div>
                  <div class="eog-s-val" id="eog-sensor-grid">DCL 61% RCL</div>
                  <div class="eog-s-sub">SEFAZ-PI / CAPAG-STN B / Selic</div>
                </div>
                <div class="eog-sensor-card">
                  <div class="eog-s-label">MALHA MUNICIPAL (IBGE)</div>
                  <div class="eog-s-val" id="eog-sensor-rf">224 MUN. PI</div>
                  <div class="eog-s-sub">UF 22 · 16 polos georreferenciados</div>
                </div>
              </div>

              <div class="eog-sub-section-title">CAMADAS ANALÍTICAS &amp; OSINT</div>
              <div class="eog-modules-status-list">
                <div class="eog-mod-item">
                  <span>GIS TERESINA [PARNAÍBA &amp; POTI]</span>
                  <span class="eog-mod-badge active">WGS84</span>
                </div>
                <div class="eog-mod-item">
                  <span>ONTOLOGIA PALANTIR [10 NÓS]</span>
                  <span class="eog-mod-badge active">INTERATIVO</span>
                </div>
                <div class="eog-mod-item">
                  <span>IBGE · BCB SGS · OPEN-METEO</span>
                  <span class="eog-mod-badge active">API DIRETA</span>
                </div>
                <div class="eog-mod-item">
                  <span>SIMULADOR LRF &amp; ANOMALIAS</span>
                  <span class="eog-mod-badge compute">AUDITORIA</span>
                </div>
                <div class="eog-mod-item">
                  <span>C4ISR CAM MATRIX [SIMULAÇÃO]</span>
                  <span class="eog-mod-badge active">6 MODOS</span>
                </div>
              </div>

              <div class="eog-sub-section-title">ANALISADOR DE ESPECTRO RF (SIM.)</div>
              <canvas id="eog-spectrum-canvas" class="eog-spectrum-box" width="280" height="72" aria-label="Analisador de espectro RF simulado"></canvas>
            </div>
          </aside>

          <!-- COLUNA 2: MODULAÇÃO DE CÂMERAS & ALVO -->
          <section class="eog-panel-box eog-center-viewport" aria-label="Modulação de câmeras Eye of God">
            <div class="eog-panel-title">
              <span>👁️ MATRIX CAM MODULATION // EYE OF GOD TARGET LOCK</span>
              <div class="eog-cam-modes-bar" role="group" aria-label="Modo de visão das câmeras">
                <button type="button" class="eog-cam-mode-btn active" data-eog-mode="OPTICAL" aria-pressed="true">ÓPTICA HUD</button>
                <button type="button" class="eog-cam-mode-btn" data-eog-mode="FLIR" aria-pressed="false">TÉRMICA FLIR</button>
                <button type="button" class="eog-cam-mode-btn" data-eog-mode="NVG" aria-pressed="false">NOTURNA NVG</button>
                <button type="button" class="eog-cam-mode-btn" data-eog-mode="LIDAR" aria-pressed="false">LIDAR 3D</button>
                <button type="button" class="eog-cam-mode-btn" data-eog-mode="NEURAL" aria-pressed="false">FLUXO IA</button>
                <button type="button" class="eog-cam-mode-btn" data-eog-mode="SAR" aria-pressed="false">ORBITAL SAR</button>
              </div>
            </div>

            <div class="eog-panel-content eog-viewport-content">
              <div class="eog-cctv-matrix-grid" id="eog-cctv-grid"></div>

              <div class="eog-target-inspect-card">
                <div class="eog-target-profile-pic">
                  <canvas id="eog-wireframe-face-canvas" width="100" height="100" aria-label="Wireframe biométrico simulado"></canvas>
                  <div class="eog-target-scan-line" aria-hidden="true"></div>
                </div>
                <div class="eog-target-data">
                  <div class="eog-target-id" id="eog-target-id-label">ALVO #01: VEÍCULO / INDIVÍDUO IDENTIFICADO</div>
                  <div class="eog-target-details" id="eog-target-details-label">Carregando telemetria…</div>
                </div>
                <div class="eog-target-actions">
                  <button type="button" class="eog-btn" id="eog-lock-target-btn">🎯 CRAVAR MIRA</button>
                  <button type="button" class="eog-btn alert-btn" id="eog-dispatch-drone-btn">🚁 DESPACHAR DRONE</button>
                </div>
              </div>
            </div>
          </section>

          <!-- COLUNA 3: GIS REAL TERESINA/PIAUÍ & GRAFO PALANTIR -->
          <aside class="eog-panel-box" id="eog-panel-radar-intel">
            <div class="eog-panel-title eog-panel-header-split">
              <span>🌐 GIS PIAUÍ &amp; RADAR C4ISR</span>
              <div class="eog-map-tabs" role="group" aria-label="Camada geográfica do radar">
                <button type="button" class="eog-map-btn active" data-eog-map="GEO-THE" aria-pressed="true">TERESINA</button>
                <button type="button" class="eog-map-btn" data-eog-map="GEO-PI" aria-pressed="false">PIAUÍ (16)</button>
                <button type="button" class="eog-map-btn" data-eog-map="RADAR" aria-pressed="false">RADAR</button>
              </div>
            </div>
            <div class="eog-panel-content">
              <div class="eog-radar-wrapper">
                <canvas id="eog-tactical-radar-canvas" width="340" height="240" aria-label="Mapa GIS Teresina Piauí e radar tático"></canvas>
                <div class="eog-radar-hud-info">
                  <span>ALVOS RASTREADOS: <b id="eog-radar-target-count">6 CAM</b></span>
                  <span>POLOS GIS: <b id="eog-radar-units-count">16 PI</b></span>
                </div>
              </div>

              <div class="eog-sub-section-title">GRAFO DE ONTOLOGIA PIAUÍ (PALANTIR MATRIX · CLICÁVEL)</div>
              <div class="eog-graph-wrapper">
                <canvas id="eog-palantir-graph-canvas" width="340" height="200" aria-label="Grafo interativo de ontologia do Piauí"></canvas>
              </div>
              <div class="eog-node-inspector" id="eog-node-inspector">
                <strong>Nó selecionado: Estado do Piauí</strong> · Clique em qualquer nó do grafo acima ou use <code>graph &lt;id&gt;</code>.
              </div>

              <div class="eog-sub-section-title">FEED DE EVENTOS TÁTICOS &amp; GOV-BR</div>
              <div class="eog-event-feed-list" id="eog-event-feed-container" aria-live="polite"></div>
            </div>
          </aside>
        </div>

        <!-- BOTTOM CLI TERMINAL DOCK -->
        <div class="eog-footer-terminal" role="region" aria-label="Terminal CLI Kernel Eye of God">
          <div class="eog-terminal-bar-header">
            <span>⚡ EYE OF GOD KERNEL TERMINAL // V.2.0-GOV-BR</span>
            <span>COMANDOS: help, pib, pop, fiscal, edu, geo pi, mun parnaiba, graph, govbr, target, thermal, scan</span>
          </div>
          <div class="eog-terminal-body" id="eog-terminal-body" role="log" aria-live="polite">
            <div class="eog-term-line output">&gt; S.P.I.A. Eye of God v2.0 carregado (GIS Teresina/Piauí WGS84 + Ontologia Palantir + APIs Gov-BR).</div>
            <div class="eog-term-line output">&gt; Digite "help" para comandos C4ISR e consultas de dados estruturados.</div>
          </div>
          <div class="eog-terminal-prompt">
            <label class="eog-prompt-symbol" for="eog-terminal-input">root@SPIA-GODS-EYE:~#</label>
            <input type="text" id="eog-terminal-input" class="eog-prompt-input" autocomplete="off" spellcheck="false" placeholder="Ex: geo pi, mun teresina, pib, fiscal, govbr, target, help...">
          </div>
        </div>
      </div>`;
  }

  function mountEyeOfGod(container, mode = 'tab') {
    if (!container) return null;
    if (!container.querySelector('#eog-hud-shell')) {
      container.innerHTML = buildHudMarkup(mode);
    }
    initEyeOfGod();
    return container.querySelector('#eog-hud-shell');
  }

  function initEyeOfGod() {
    const tabPanel = document.getElementById('tab-eye-of-god');
    if (!tabPanel) return;

    const mountTarget = tabPanel.querySelector('[data-eog-mount]') || tabPanel;
    if (!document.getElementById('eog-hud-shell')) {
      const mode = mountTarget.dataset.eogMount || 'tab';
      mountTarget.innerHTML = buildHudMarkup(mode);
    }

    const shell = document.getElementById('eog-hud-shell');
    if (!shell || shell.dataset.initialized === 'true') return;
    shell.dataset.initialized = 'true';

    const ontology = window.PIAUI_ONTOLOGY || null;

    // ==================== ESTADO & DADOS ====================
    const camerasDB = [
      {
        id: 'CAM-01',
        loc: 'Pte. Estaiada / Av. Raul Lopes',
        zone: 'ZL',
        lat: -5.0688,
        lng: -42.8012,
        targetId: 'ALVO #01: VEÍCULO / INDIVÍDUO IDENTIFICADO',
        plate: 'PIU-8B42',
        model: 'Toyota Hilux Prata',
        confidence: '98.9%',
        route: 'Sentido Norte (68 km/h)',
        unit: 'RONE-04',
        imei: 'IMEI 8642...19'
      },
      {
        id: 'CAM-02',
        loc: 'Av. Frei Serafim / São Benedito',
        zone: 'CT',
        lat: -5.0894,
        lng: -42.8095,
        targetId: 'ALVO #02: MONITORAMENTO CORREDOR CENTRAL',
        plate: 'NHW-4E19',
        model: 'Honda Civic Preto',
        confidence: '96.4%',
        route: 'Sentido Centro (52 km/h)',
        unit: 'BOPE-01',
        imei: 'IMEI 3590...44'
      },
      {
        id: 'CAM-03',
        loc: 'Terminal Mocambinho (Norte)',
        zone: 'ZN',
        lat: -5.0415,
        lng: -42.8112,
        targetId: 'ALVO #03: CERCO ZONA NORTE',
        plate: 'QRT-9A71',
        model: 'Fiat Toro Branca',
        confidence: '94.7%',
        route: 'Av. Duque de Caxias (44 km/h)',
        unit: 'FT-ZN-02',
        imei: 'IMEI 4912...83'
      },
      {
        id: 'CAM-04',
        loc: 'Grande Dirceu / Av. Principal',
        zone: 'ZSE',
        lat: -5.1072,
        lng: -42.7525,
        targetId: 'ALVO #04: VARREDURA SUDESTE',
        plate: 'PIJ-2C88',
        model: 'VW Gol Cinza',
        confidence: '97.1%',
        route: 'Sentido Sudeste (61 km/h)',
        unit: 'RONE-02',
        imei: 'IMEI 7105...62'
      },
      {
        id: 'CAM-05',
        loc: 'Ponte Metálica / Divisa Timon',
        zone: 'ZO',
        lat: -5.0865,
        lng: -42.8235,
        targetId: 'ALVO #05: PONTO DE DIVISA INTERESTADUAL',
        plate: 'OXZ-7D05',
        model: 'Honda XRE 300',
        confidence: '95.8%',
        route: 'Travessia Piauí-MA (74 km/h)',
        unit: 'BPTRAN-07',
        imei: 'IMEI 2284...05'
      },
      {
        id: 'CAM-06',
        loc: 'Aeroporto Sen. Petrônio Portella',
        zone: 'ZN',
        lat: -5.0598,
        lng: -42.8238,
        targetId: 'ALVO #06: PERÍMETRO AEROPORTUÁRIO',
        plate: 'LVX-5F30',
        model: 'Chevrolet Tracker Azul',
        confidence: '99.1%',
        route: 'Área de Embarque (28 km/h)',
        unit: 'CICC-AIR',
        imei: 'IMEI 9031...71'
      }
    ];

    const modeLabels = {
      OPTICAL: 'ÓPTICA HUD',
      FLIR: 'TÉRMICA FLIR',
      NVG: 'NOTURNA NVG',
      LIDAR: 'LIDAR 3D',
      NEURAL: 'FLUXO IA',
      SAR: 'ORBITAL SAR'
    };

    const sampleEvents = [
      { text: 'GIS: Rios Parnaíba e Poti calibrados em WGS84', crit: false },
      { text: 'LPR: Placa PIU-8B42 monitorada em Pte. Estaiada (sim.)', crit: true },
      { text: 'ONTOLOGIA: 10 nós estratégicos do Piauí vinculados', crit: false },
      { text: 'FISCAL-PI: DCL 56,1% da RCL 2025 (61% ref. ant. | Teto: 200%)', crit: false }
    ];

    let activeCamMode = 'OPTICAL';
    let activeMapMode = 'GEO-THE';
    let selectedNodeId = 'PI';
    let selectedHubIbge = '2211001';
    let focusedCamIdx = 0;
    let soundEnabled = true;
    let lockdownActive = false;
    let targetLocked = false;
    let droneDispatched = false;
    let customTargetLabel = null;
    let audioCtx = null;
    let rafId = null;
    let clockTimer = null;
    let eventTimer = null;
    let lastSpecTime = 0;
    let lastTelemetryTime = 0;
    let renderedGraphNodes = [];
    const cmdHistory = [];
    let historyPos = -1;

    const reducedMotion = Boolean(
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    // ==================== 1. ÁUDIO TÁTICO ====================
    function playTacticalSound(freq = 880, type = 'sine', duration = 0.06, vol = 0.04) {
      if (!soundEnabled) return;
      const AudioConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioConstructor) return;
      try {
        if (!audioCtx) audioCtx = new AudioConstructor();
        if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
          audioCtx.resume().catch(() => {});
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (_) {}
    }

    const audioBtn = document.getElementById('eog-audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        audioBtn.textContent = soundEnabled ? '🔊 AUDIO: ON' : '🔇 AUDIO: OFF';
        audioBtn.setAttribute('aria-pressed', String(soundEnabled));
        if (soundEnabled) playTacticalSound(1200, 'square', 0.1);
      });
    }

    // ==================== 2. TERMINAL CLI KERNEL ====================
    const termBody = document.getElementById('eog-terminal-body');
    const termInput = document.getElementById('eog-terminal-input');

    function printTerminal(msg, type = 'output') {
      if (!termBody) return;
      const line = document.createElement('div');
      line.className = `eog-term-line ${type}`;
      line.textContent = `> ${msg}`;
      termBody.appendChild(line);
      while (termBody.children.length > 90) {
        termBody.firstElementChild.remove();
      }
      termBody.scrollTop = termBody.scrollHeight;
    }

    // ==================== 3. FEED DE EVENTOS ====================
    const eventFeedContainer = document.getElementById('eog-event-feed-container');

    function formatFortalezaTime(date, withMs = false) {
      try {
        const parts = new Intl.DateTimeFormat('pt-BR', {
          timeZone: 'America/Fortaleza',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).formatToParts(date);
        const get = t => (parts.find(p => p.type === t) || {}).value || '00';
        const base = `${get('hour')}:${get('minute')}:${get('second')}`;
        return withMs ? `${base}.${String(date.getMilliseconds()).padStart(3, '0')}` : base;
      } catch (_) {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return withMs ? `${h}:${m}:${s}.${String(date.getMilliseconds()).padStart(3, '0')}` : `${h}:${m}:${s}`;
      }
    }

    function pushEventFeed(ev) {
      if (!eventFeedContainer) return;
      const row = document.createElement('div');
      row.className = `eog-event-row ${ev.crit ? 'crit' : ''}`;
      const label = document.createElement('span');
      label.textContent = ev.text;
      const stamp = document.createElement('span');
      stamp.textContent = formatFortalezaTime(new Date());
      row.append(label, stamp);
      eventFeedContainer.prepend(row);
      while (eventFeedContainer.children.length > 6) {
        eventFeedContainer.lastElementChild.remove();
      }
    }

    sampleEvents.forEach(ev => pushEventFeed(ev));

    // ==================== 4. MATRIX RAIN CANVAS ====================
    const rainCanvas = document.getElementById('eog-matrix-rain-canvas');
    const matrixChars = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ10234567890ABCDEF0x';
    const rainFontSize = 14;
    let rainDrops = [];

    function resizeMatrixRain() {
      const rainCtx = safeCtx(rainCanvas);
      if (!rainCanvas || !rainCtx) return;
      const w = Math.max(shell.clientWidth || 960, 320);
      const h = Math.max(shell.clientHeight || 720, 400);
      if (rainCanvas.width !== w || rainCanvas.height !== h) {
        rainCanvas.width = w;
        rainCanvas.height = h;
        const cols = Math.max(1, Math.floor(w / rainFontSize));
        rainDrops = Array.from({ length: cols }, () => Math.floor(Math.random() * 20));
      }
    }

    function renderMatrixRain() {
      const rainCtx = safeCtx(rainCanvas);
      if (!rainCanvas || !rainCtx) return;
      if (!rainDrops.length) resizeMatrixRain();
      rainCtx.fillStyle = 'rgba(2, 4, 8, 0.1)';
      rainCtx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
      rainCtx.fillStyle = lockdownActive ? '#ff003c' : '#00ff66';
      rainCtx.font = `${rainFontSize}px "Share Tech Mono", monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        rainCtx.fillText(char, i * rainFontSize, rainDrops[i] * rainFontSize);
        if (rainDrops[i] * rainFontSize > rainCanvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    }

    // ==================== 5. RELÓGIO & TELEMETRIA REAL GOV-BR ====================
    function syncRealtimeSensors() {
      const rt = window.PiauiRealtime ? window.PiauiRealtime.getState() : null;
      const tempEl = document.getElementById('eog-sensor-temp');
      const popEl = document.getElementById('eog-sensor-pop');
      const gridEl = document.getElementById('eog-sensor-grid');
      const rfEl = document.getElementById('eog-sensor-rf');
      const srcTag = document.getElementById('eog-gov-source-tag');

      if (rt && rt.weather && rt.weather.teresina && rt.weather.teresina.tempC != null) {
        if (tempEl) tempEl.textContent = `${Number(rt.weather.teresina.tempC).toFixed(1)}°C (UV ${rt.weather.teresina.uv ?? '—'})`;
      } else if (tempEl) {
        tempEl.textContent = 'MODO LOCAL';
      }

      if (popEl) {
        popEl.textContent = rt && rt.ibge && rt.ibge.populacaoBrasilProjecao
          ? `PI 3.384.547 · BR ${(Number(rt.ibge.populacaoBrasilProjecao) / 1e6).toFixed(1)}M`
          : '3.384.547 (IBGE)';
      }

      if (gridEl) {
        gridEl.textContent = rt && rt.bcb && rt.bcb.selic && rt.bcb.selic.valor != null
          ? `SELIC ${rt.bcb.selic.valor}% · DCL 56,1%`
          : 'DCL 56,1% RCL';
      }

      if (rfEl) {
        const muns = rt && rt.ibge ? (rt.ibge.municipiosCount || 224) : 224;
        rfEl.textContent = rt && rt.status === 'online' ? `${muns} MUN. · ONLINE` : `${muns} MUN. · LOCAL`;
      }

      if (srcTag && rt) {
        srcTag.textContent = rt.status === 'online' ? 'GOV-BR AO VIVO' : (rt.status === 'partial' ? 'GOV-BR PARCIAL' : 'BASE LOCAL');
      }
    }

    function updateTacticalClock() {
      const now = new Date();
      const clockEl = document.getElementById('eog-tactical-clock');
      const hashEl = document.getElementById('eog-kernel-hash');
      if (clockEl) clockEl.textContent = formatFortalezaTime(now, true);
      if (hashEl) hashEl.textContent = '0x' + Math.random().toString(16).substring(2, 10).toUpperCase();

      const ts = now.getTime();
      if (ts - lastTelemetryTime > 2600) {
        lastTelemetryTime = ts;
        syncRealtimeSensors();
      }
    }

    document.addEventListener('piaui:realtime-update', event => {
      syncRealtimeSensors();
      const detail = event.detail || {};
      if (detail.status === 'online') {
        pushEventFeed({ text: 'GOV-BR: IBGE, BCB e Clima Teresina sincronizados', crit: false });
      }
    });

    // ==================== 6. INSPEÇÃO DE ALVO ====================
    function updateTargetInspectCard() {
      const cam = camerasDB[focusedCamIdx] || camerasDB[0];
      const idEl = document.getElementById('eog-target-id-label');
      const detailsEl = document.getElementById('eog-target-details-label');
      if (idEl) {
        idEl.textContent = customTargetLabel
          ? `ALVO DIRECIONADO: ${customTargetLabel.toUpperCase()}`
          : cam.targetId;
      }
      if (detailsEl) {
        detailsEl.replaceChildren();
        const addSpan = (text, highlight = false) => {
          if (highlight) {
            const s = document.createElement('span');
            s.className = 'eog-highlight';
            s.textContent = text;
            detailsEl.appendChild(s);
          } else {
            detailsEl.appendChild(document.createTextNode(text));
          }
        };
        addSpan('PLACA: ');
        addSpan(cam.plate, true);
        addSpan(' · MODELO: ');
        addSpan(cam.model, true);
        addSpan(' · RECON: ');
        addSpan(cam.confidence, true);
        detailsEl.appendChild(document.createElement('br'));
        addSpan('VISTO EM: ');
        addSpan(cam.loc, true);
        addSpan(' · ROTA: ');
        addSpan(cam.route, true);
      }
    }

    // ==================== 7. CÂMERAS MODULADAS ====================
    const cctvGrid = document.getElementById('eog-cctv-grid');

    function focusCamera(idx) {
      if (idx < 0 || idx >= camerasDB.length) return;
      focusedCamIdx = idx;
      customTargetLabel = null;
      $$('.eog-cam-cell', cctvGrid).forEach((cell, i) => {
        const isFocus = i === idx;
        cell.classList.toggle('focus', isFocus);
        cell.setAttribute('aria-pressed', String(isFocus));
      });
      updateTargetInspectCard();
      playTacticalSound(960, 'sine', 0.05);
    }

    function buildCameraGrid() {
      if (!cctvGrid) return;
      cctvGrid.replaceChildren();
      camerasDB.forEach((cam, idx) => {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = `eog-cam-cell ${idx === focusedCamIdx ? 'focus' : ''}`;
        cell.setAttribute('aria-pressed', String(idx === focusedCamIdx));
        cell.setAttribute('aria-label', `${cam.id} ${cam.loc}`);
        cell.dataset.camIdx = String(idx);

        const canvas = document.createElement('canvas');
        canvas.className = 'eog-cam-canvas';
        canvas.id = `eog-canvas-cctv-${idx}`;
        canvas.width = 280;
        canvas.height = 157;

        const overlay = document.createElement('div');
        overlay.className = 'eog-cam-overlay-hud';

        const headerTag = document.createElement('div');
        headerTag.className = 'eog-cam-header-tag';
        const camSpan = document.createElement('span');
        camSpan.className = 'eog-cam-id';
        camSpan.textContent = `${cam.id} // ${cam.zone}`;
        const recSpan = document.createElement('span');
        recSpan.className = 'eog-cam-rec';
        recSpan.textContent = '● SIM_HUD';
        headerTag.append(camSpan, recSpan);

        const locDiv = document.createElement('div');
        locDiv.className = 'eog-cam-loc';
        locDiv.textContent = cam.loc;

        overlay.append(headerTag, locDiv);
        cell.append(canvas, overlay);
        cell.addEventListener('click', () => {
          focusCamera(idx);
          printTerminal(`Foco óptico direcionado para ${cam.id} (${cam.loc}).`, 'success');
        });
        cctvGrid.appendChild(cell);
      });
    }

    function setCameraMode(mode) {
      const normalized = String(mode || '').toUpperCase();
      if (!modeLabels[normalized]) return false;
      activeCamMode = normalized;
      $$('.eog-cam-mode-btn', tabPanel).forEach(btn => {
        const isCurrent = btn.dataset.eogMode === activeCamMode;
        btn.classList.toggle('active', isCurrent);
        btn.setAttribute('aria-pressed', String(isCurrent));
      });
      playTacticalSound(900, 'triangle', 0.08);
      printTerminal(`Modo de visão de câmera alterado para: [${activeCamMode} · ${modeLabels[activeCamMode]}]`, 'success');
      renderCCTVFeeds(Date.now());
      return true;
    }

    $$('.eog-cam-mode-btn', tabPanel).forEach(btn => {
      btn.addEventListener('click', () => setCameraMode(btn.dataset.eogMode));
    });

    function renderCCTVFeeds(nowMs) {
      const time = nowMs * 0.002;
      camerasDB.forEach((cam, idx) => {
        const canvas = document.getElementById(`eog-canvas-cctv-${idx}`);
        const ctx = safeCtx(canvas);
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = '#02050a';
        ctx.fillRect(0, 0, w, h);

        if (activeCamMode === 'OPTICAL') {
          ctx.strokeStyle = 'rgba(0, 255, 102, 0.22)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(w / 2, h * 0.25);
          ctx.lineTo(w * 0.08, h);
          ctx.moveTo(w / 2, h * 0.25);
          ctx.lineTo(w * 0.92, h);
          ctx.moveTo(w * 0.3, h * 0.55);
          ctx.lineTo(w * 0.7, h * 0.55);
          ctx.stroke();

          const bx = (Math.sin(time + idx * 1.1) * 0.28 + 0.42) * w;
          const by = (Math.cos(time + idx * 0.9) * 0.18 + 0.48) * h;
          ctx.strokeStyle = idx === focusedCamIdx && targetLocked ? '#ff003c' : '#00f0ff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx, by, 50, 26);
          ctx.fillStyle = ctx.strokeStyle;
          ctx.font = '8px "Share Tech Mono", monospace';
          ctx.fillText(`${cam.plate} ${cam.confidence}`, bx, by - 4);
        } else if (activeCamMode === 'FLIR') {
          const hx = w * 0.5 + Math.sin(time + idx) * 42;
          const hy = h * 0.52 + Math.cos(time * 0.8 + idx) * 16;
          const rad = ctx.createRadialGradient(hx, hy, 8, hx, hy, 92);
          rad.addColorStop(0, '#ffffff');
          rad.addColorStop(0.28, '#ffe600');
          rad.addColorStop(0.58, '#ff003c');
          rad.addColorStop(1, '#120f38');
          ctx.fillStyle = rad;
          ctx.fillRect(0, 0, w, h);
          ctx.strokeStyle = 'rgba(255,255,255,0.6)';
          ctx.strokeRect(hx - 18, hy - 12, 36, 24);
          ctx.fillStyle = '#fff';
          ctx.font = '8px "Share Tech Mono", monospace';
          ctx.fillText('FLIR SIM', hx - 16, hy - 16);
        } else if (activeCamMode === 'NVG') {
          ctx.fillStyle = 'rgba(0, 255, 102, 0.14)';
          ctx.fillRect(0, 0, w, h);
          for (let i = 0; i < 42; i++) {
            ctx.fillStyle = 'rgba(0, 255, 102, 0.55)';
            ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
          }
          const nx = (Math.sin(time * 0.9 + idx) * 0.25 + 0.45) * w;
          const ny = h * 0.55;
          ctx.strokeStyle = '#00ff66';
          ctx.strokeRect(nx, ny, 38, 22);
          ctx.fillStyle = '#00ff66';
          ctx.font = '8px "Share Tech Mono", monospace';
          ctx.fillText('IR_GAIN +42dB', 8, h - 22);
        } else if (activeCamMode === 'LIDAR') {
          ctx.strokeStyle = 'rgba(0, 255, 102, 0.45)';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 16) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }
          const offset = Math.sin(time + idx) * 14;
          ctx.strokeStyle = '#00f0ff';
          ctx.strokeRect(70 + offset, 45, 48, 52);
          ctx.strokeRect(160 - offset, 52, 54, 46);
        } else if (activeCamMode === 'NEURAL') {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 1;
          for (let i = 0; i < 14; i++) {
            const px = (Math.sin(time + i + idx) * 0.38 + 0.5) * w;
            const py = (Math.cos(time * 1.2 + i) * 0.34 + 0.5) * h;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + Math.cos(time + i) * 14, py + Math.sin(time + i) * 10);
            ctx.stroke();
          }
        } else if (activeCamMode === 'SAR') {
          ctx.strokeStyle = 'rgba(0, 255, 102, 0.38)';
          ctx.lineWidth = 1;
          [26, 48].forEach(r => {
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
            ctx.stroke();
          });
          ctx.strokeStyle = '#00ff66';
          ctx.beginPath();
          ctx.moveTo(w / 2, h / 2);
          ctx.lineTo(w / 2 + Math.cos(time * 2 + idx) * 52, h / 2 + Math.sin(time * 2 + idx) * 52);
          ctx.stroke();
          ctx.fillStyle = '#00f0ff';
          ctx.fillRect(w / 2 + Math.cos(idx) * 28, h / 2 + Math.sin(idx) * 20, 4, 4);
        }
      });
    }

    // ==================== 8. WIREFRAME FACIAL ====================
    const faceCanvas = document.getElementById('eog-wireframe-face-canvas');

    function renderWireframeFace(nowMs) {
      const faceCtx = safeCtx(faceCanvas);
      if (!faceCtx || !faceCanvas) return;
      const w = faceCanvas.width;
      const h = faceCanvas.height;
      faceCtx.clearRect(0, 0, w, h);
      faceCtx.strokeStyle = lockdownActive ? '#ff003c' : '#00ff66';
      faceCtx.lineWidth = 1.2;

      const t = nowMs * 0.003;
      const cx = w / 2;
      const cy = h / 2;

      faceCtx.beginPath();
      faceCtx.arc(cx, cy, 32 + Math.sin(t) * 1.5, 0, Math.PI * 2);
      faceCtx.moveTo(cx - 16, cy - 8);
      faceCtx.lineTo(cx - 6, cy - 8);
      faceCtx.moveTo(cx + 6, cy - 8);
      faceCtx.lineTo(cx + 16, cy - 8);
      faceCtx.moveTo(cx, cy - 6);
      faceCtx.lineTo(cx, cy + 8);
      faceCtx.moveTo(cx - 12, cy + 16);
      faceCtx.lineTo(cx + 12, cy + 16);
      faceCtx.stroke();

      faceCtx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      faceCtx.beginPath();
      faceCtx.moveTo(cx - 30, cy);
      faceCtx.lineTo(cx + 30, cy);
      faceCtx.moveTo(cx, cy - 30);
      faceCtx.lineTo(cx, cy + 30);
      faceCtx.stroke();
    }

    // ==================== 9. MAPA GIS REAL (TERESINA / PIAUÍ) + RADAR ====================
    const radarCanvas = document.getElementById('eog-tactical-radar-canvas');

    function setMapMode(mode) {
      const norm = String(mode || '').toUpperCase();
      if (!['GEO-THE', 'GEO-PI', 'RADAR'].includes(norm)) return false;
      activeMapMode = norm;
      $$('.eog-map-btn', tabPanel).forEach(btn => {
        const isCurrent = btn.dataset.eogMap === activeMapMode;
        btn.classList.toggle('active', isCurrent);
        btn.setAttribute('aria-pressed', String(isCurrent));
      });
      renderTacticalRadar(Date.now());
      return true;
    }

    $$('.eog-map-btn', tabPanel).forEach(btn => {
      btn.addEventListener('click', () => {
        setMapMode(btn.dataset.eogMap);
        printTerminal(`Camada GIS alterada para [${activeMapMode}].`, 'success');
      });
    });

    function projectPoint(lat, lng, bounds, w, h, pad = 18) {
      const minLon = bounds.minLon ?? bounds.minLng;
      const maxLon = bounds.maxLon ?? bounds.maxLng;
      const x = pad + ((lng - minLon) / (maxLon - minLon)) * (w - pad * 2);
      const y = h - pad - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * (h - pad * 2);
      return [x, y];
    }

    function renderTacticalRadar(nowMs) {
      const ctx = safeCtx(radarCanvas);
      if (!ctx || !radarCanvas) return;
      const w = radarCanvas.width;
      const h = radarCanvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const time = nowMs * 0.0015;

      ctx.fillStyle = '#01050a';
      ctx.fillRect(0, 0, w, h);

      // Grade coordenada sutil
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let gx = 34; gx < w; gx += 48) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }
      for (let gy = 28; gy < h; gy += 46) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }

      if (activeMapMode === 'GEO-THE' && ontology && ontology.teresinaGeo) {
        const tg = ontology.teresinaGeo;
        const bounds = tg.bounds;
        const drawLine = (pts, color, width = 2) => {
          if (!pts || !pts.length) return;
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.beginPath();
          pts.forEach(([lat, lon], i) => {
            const [x, y] = projectPoint(lat, lon, bounds, w, h, 16);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          });
          ctx.stroke();
        };

        // Rios reais e corredores viários de Teresina
        drawLine(tg.rioParnaiba, 'rgba(0, 175, 255, 0.55)', 3);
        drawLine(tg.rioPoti, 'rgba(0, 240, 255, 0.45)', 2.2);
        (tg.corridors || []).forEach(c => drawLine(c.points, 'rgba(255, 230, 0, 0.38)', 1.3));

        // Pontos estratégicos
        (tg.points || []).forEach(pt => {
          const [px, py] = projectPoint(pt.lat, pt.lon, bounds, w, h, 16);
          ctx.fillStyle = pt.type === 'totem' ? '#ff003c' : (pt.type === 'infra' ? '#ffe600' : '#00ff66');
          ctx.beginPath(); ctx.arc(px, py, 2.8, 0, Math.PI * 2); ctx.fill();
          if (pt.type !== 'camera') {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '8px "Share Tech Mono", monospace';
            ctx.fillText(pt.id, px + 5, py + 3);
          }
        });

        // Câmeras em coordenadas reais de Teresina
        camerasDB.forEach((cam, idx) => {
          const [px, py] = projectPoint(cam.lat, cam.lng, bounds, w, h, 16);
          const isFocus = idx === focusedCamIdx;
          ctx.fillStyle = isFocus ? '#ff003c' : '#ffe600';
          ctx.beginPath(); ctx.arc(px, py, isFocus ? 4.5 : 3, 0, Math.PI * 2); ctx.fill();
          if (isFocus && targetLocked) {
            ctx.strokeStyle = '#ffe600';
            ctx.strokeRect(px - 7, py - 7, 14, 14);
          }
          ctx.fillStyle = '#fff';
          ctx.font = '8px "Share Tech Mono", monospace';
          ctx.fillText(cam.id, px + 6, py - 4);
        });

        ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
        ctx.font = '8px "Share Tech Mono", monospace';
        ctx.fillText('GIS TERESINA · PARNAÍBA & POTI (WGS84)', 8, 12);
      } else if (activeMapMode === 'GEO-PI' && ontology && ontology.piauiPolygon) {
        const bounds = { minLat: -11.1, maxLat: -2.6, minLng: -46.1, maxLng: -40.2 };
        ctx.strokeStyle = lockdownActive ? 'rgba(255, 0, 60, 0.7)' : 'rgba(0, 255, 102, 0.55)';
        ctx.fillStyle = 'rgba(0, 255, 102, 0.06)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ontology.piauiPolygon.forEach(([lat, lon], i) => {
          const [x, y] = projectPoint(lat, lon, bounds, w, h, 14);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        if (typeof ctx.closePath === 'function') ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ontology.municipalities.forEach(mun => {
          const [mx, my] = projectPoint(mun.lat, mun.lon, bounds, w, h, 14);
          const isCapital = String(mun.ibge) === '2211001';
          const isSelected = String(mun.ibge) === String(selectedHubIbge);
          ctx.fillStyle = isSelected ? '#00ff66' : (isCapital ? '#ff003c' : (mun.territory.includes('Chapada') || mun.territory.includes('Tabuleiros') ? '#ffe600' : '#00f0ff'));
          ctx.beginPath(); ctx.arc(mx, my, isSelected ? 5 : (isCapital ? 4.5 : 2.8), 0, Math.PI * 2); ctx.fill();
          if (isSelected) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.arc(mx, my, 8, 0, Math.PI * 2); ctx.stroke();
          }
          if (isSelected || isCapital || ['Parnaíba', 'Picos', 'Bom Jesus', 'Uruçuí', 'Floriano', 'São Raimundo Nonato'].includes(mun.name)) {
            ctx.fillStyle = isSelected ? '#00ff66' : '#e2e8f0';
            ctx.font = '8px "Share Tech Mono", monospace';
            ctx.fillText(mun.name.slice(0, 12), mx + 5, my + 2);
          }
        });
        ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
        ctx.font = '8px "Share Tech Mono", monospace';
        ctx.fillText('GIS PIAUÍ · 16 POLOS ESTRATÉGICOS (WGS84)', 8, 12);
      }

      // Varredura radar sutil em qualquer camada (mais forte em RADAR)
      if (activeMapMode === 'RADAR') {
        ctx.strokeStyle = 'rgba(0, 255, 102, 0.25)';
        ctx.lineWidth = 1;
        [38, 76, 108].forEach(r => {
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        });
        ctx.beginPath();
        ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
        ctx.moveTo(0, cy); ctx.lineTo(w, cy);
        ctx.stroke();
      }

      ctx.strokeStyle = lockdownActive ? 'rgba(255, 0, 60, 0.7)' : 'rgba(0, 255, 102, 0.5)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(time) * 112, cy + Math.sin(time) * 112);
      ctx.stroke();

      if (droneDispatched) {
        const dx = cx + Math.cos(time * 2.2) * 38;
        const dy = cy + Math.sin(time * 2.2) * 30;
        ctx.fillStyle = '#ffe600';
        ctx.beginPath(); ctx.arc(dx, dy, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.font = '8px "Share Tech Mono", monospace';
        ctx.fillText('DRONE-02', dx + 6, dy + 3);
      }
    }

    if (radarCanvas) {
      radarCanvas.addEventListener('click', event => {
        const rect = radarCanvas.getBoundingClientRect();
        const scaleX = radarCanvas.width / Math.max(rect.width, 1);
        const scaleY = radarCanvas.height / Math.max(rect.height, 1);
        const cx = (event.clientX - rect.left) * scaleX;
        const cy = (event.clientY - rect.top) * scaleY;
        if (activeMapMode === 'GEO-PI' && ontology && Array.isArray(ontology.municipalities)) {
          const bounds = { minLat: -11.1, maxLat: -2.6, minLng: -46.1, maxLng: -40.2 };
          let hit = null;
          let minD = 22;
          ontology.municipalities.forEach(mun => {
            const [mx, my] = projectPoint(mun.lat, mun.lon, bounds, radarCanvas.width, radarCanvas.height, 14);
            const d = Math.hypot(mx - cx, my - cy);
            if (d < minD) { minD = d; hit = mun; }
          });
          if (hit) {
            selectedHubIbge = String(hit.ibge);
            playTacticalSound(1050, 'sine', 0.05);
            printTerminal(`GIS PIAUÍ [${hit.ibge}]: ${hit.name} · Pop. ${hit.pop2022.toLocaleString('pt-BR')} · ${hit.territory} · ${hit.role}`, 'success');
            renderTacticalRadar(Date.now());
          }
        } else if (activeMapMode === 'GEO-THE' && ontology && ontology.teresinaGeo) {
          const bounds = ontology.teresinaGeo.bounds;
          let hitIdx = -1;
          let minD = 24;
          camerasDB.forEach((cam, idx) => {
            const [px, py] = projectPoint(cam.lat, cam.lng, bounds, radarCanvas.width, radarCanvas.height, 16);
            const d = Math.hypot(px - cx, py - cy);
            if (d < minD) { minD = d; hitIdx = idx; }
          });
          if (hitIdx >= 0) {
            focusCamera(hitIdx);
            printTerminal(`GIS TERESINA: Foco ajustado para ${camerasDB[hitIdx].id} (${camerasDB[hitIdx].loc}).`, 'success');
            renderTacticalRadar(Date.now());
          }
        }
      });
    }

    // ==================== 10. GRAFO DE ONTOLOGIA PALANTIR INTERATIVO ====================
    const graphCanvas = document.getElementById('eog-palantir-graph-canvas');
    const nodeInspector = document.getElementById('eog-node-inspector');

    function updateNodeInspector(nodeId) {
      if (!nodeInspector || !ontology) return;
      const node = ontology.ontologyGraph.nodes.find(n => n.id === nodeId) || ontology.ontologyGraph.nodes[0];
      if (!node) return;
      selectedNodeId = node.id;
      const links = ontology.ontologyGraph.edges
        .filter(([from, to]) => from === node.id || to === node.id)
        .map(([from, to, relation]) => {
          const peerId = from === node.id ? to : from;
          const peer = ontology.ontologyGraph.nodes.find(n => n.id === peerId);
          return `${relation}: ${peer ? peer.label : peerId}`;
        });
      nodeInspector.replaceChildren();
      const title = document.createElement('strong');
      title.textContent = `${node.label} [${node.group.toUpperCase()}]`;
      nodeInspector.append(
        title,
        document.createTextNode(` · ${node.detail}`),
        document.createElement('br'),
        document.createTextNode(`Vínculos: ${links.join(' | ')}`)
      );
    }

    function renderPalantirGraph(nowMs) {
      const graphCtx = safeCtx(graphCanvas);
      if (!graphCtx || !graphCanvas) return;
      const w = graphCanvas.width;
      const h = graphCanvas.height;
      const t = nowMs * 0.002;

      graphCtx.fillStyle = '#01050a';
      graphCtx.fillRect(0, 0, w, h);

      if (ontology && ontology.ontologyGraph) {
        const nodes = ontology.ontologyGraph.nodes;
        const cx = w / 2;
        const cy = h / 2;
        renderedGraphNodes = nodes.map((n, idx) => {
          if (idx === 0) return { ...n, x: cx, y: cy };
          const angle = ((idx - 1) / (nodes.length - 1)) * Math.PI * 2 - Math.PI / 2;
          return { ...n, x: cx + Math.cos(angle) * 124, y: cy + Math.sin(angle) * 76 };
        });
        const byId = Object.fromEntries(renderedGraphNodes.map(n => [n.id, n]));

        ontology.ontologyGraph.edges.forEach(([from, to], i) => {
          const a = byId[from];
          const b = byId[to];
          if (!a || !b) return;
          const highlighted = from === selectedNodeId || to === selectedNodeId;
          graphCtx.strokeStyle = highlighted ? 'rgba(0, 255, 102, 0.72)' : 'rgba(0, 240, 255, 0.22)';
          graphCtx.lineWidth = highlighted ? 1.5 : 1;
          graphCtx.beginPath(); graphCtx.moveTo(a.x, a.y); graphCtx.lineTo(b.x, b.y); graphCtx.stroke();

          if (highlighted) {
            const ratio = (t * 0.4 + i * 0.17) % 1;
            graphCtx.fillStyle = '#ffe600';
            graphCtx.fillRect(a.x + (b.x - a.x) * ratio - 1.5, a.y + (b.y - a.y) * ratio - 1.5, 3, 3);
          }
        });

        renderedGraphNodes.forEach(node => {
          const isSel = node.id === selectedNodeId;
          graphCtx.fillStyle = node.color || '#00f0ff';
          graphCtx.beginPath();
          graphCtx.arc(node.x, node.y, isSel ? 6.5 : 4.5, 0, Math.PI * 2);
          graphCtx.fill();
          if (isSel) {
            graphCtx.strokeStyle = '#fff';
            graphCtx.lineWidth = 1.2;
            graphCtx.beginPath(); graphCtx.arc(node.x, node.y, 9, 0, Math.PI * 2); graphCtx.stroke();
          }
          graphCtx.fillStyle = isSel ? '#fff' : '#cbd5e1';
          graphCtx.font = '8px "Share Tech Mono", monospace';
          graphCtx.fillText(node.label.slice(0, 14), node.x - 24, node.y - 9);
        });
      }
    }

    if (graphCanvas) {
      graphCanvas.addEventListener('click', event => {
        if (!renderedGraphNodes.length) return;
        const rect = graphCanvas.getBoundingClientRect();
        const scaleX = graphCanvas.width / Math.max(rect.width, 1);
        const scaleY = graphCanvas.height / Math.max(rect.height, 1);
        const cx = (event.clientX - rect.left) * scaleX;
        const cy = (event.clientY - rect.top) * scaleY;
        let hit = null;
        let minD = 20;
        renderedGraphNodes.forEach(n => {
          const d = Math.hypot(n.x - cx, n.y - cy);
          if (d < minD) { minD = d; hit = n; }
        });
        if (hit) {
          updateNodeInspector(hit.id);
          playTacticalSound(1020, 'sine', 0.05);
          printTerminal(`NÓ ONTOLÓGICO [${hit.id}]: ${hit.label} — ${hit.detail}`, 'success');
          renderPalantirGraph(Date.now());
        }
      });
    }

    // ==================== 11. ESPECTRO RF ====================
    const specCanvas = document.getElementById('eog-spectrum-canvas');

    function renderSpectrum(nowMs) {
      const specCtx = safeCtx(specCanvas);
      if (!specCtx || !specCanvas) return;
      if (nowMs - lastSpecTime < 80) return;
      lastSpecTime = nowMs;

      specCtx.fillStyle = '#000';
      specCtx.fillRect(0, 0, specCanvas.width, specCanvas.height);
      const bars = 32;
      const barWidth = specCanvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const h = Math.max(4, Math.random() * specCanvas.height * 0.85);
        specCtx.fillStyle = lockdownActive
          ? (i % 3 === 0 ? '#ff003c' : '#ffe600')
          : (i % 4 === 0 ? '#00f0ff' : '#00ff66');
        specCtx.fillRect(i * barWidth, specCanvas.height - h, Math.max(1, barWidth - 1.5), h);
      }
    }

    // ==================== 12. AÇÕES TÁTICAS ====================
    const lockdownBtn = document.getElementById('eog-lockdown-btn');
    const defconStatus = document.getElementById('eog-defcon-status');
    const lockTargetBtn = document.getElementById('eog-lock-target-btn');
    const dispatchDroneBtn = document.getElementById('eog-dispatch-drone-btn');

    function setLockdown(active) {
      lockdownActive = Boolean(active);
      shell.classList.toggle('lockdown-active', lockdownActive);
      if (defconStatus) {
        defconStatus.textContent = lockdownActive ? 'NÍVEL 1 - CRÍTICO' : 'NÍVEL 2 - ELEVADO';
        defconStatus.className = `eog-pill-value ${lockdownActive ? 'crit' : 'warn'}`;
      }
      if (lockdownBtn) {
        lockdownBtn.textContent = lockdownActive ? '🛑 ENCERRAR LOCKDOWN' : '🚨 LOCKDOWN TOTAL';
        lockdownBtn.setAttribute('aria-pressed', String(lockdownActive));
      }
      if (lockdownActive) {
        playTacticalSound(220, 'sawtooth', 0.45, 0.08);
        printTerminal('🚨 ALERTA GERAL: PROTOCOLO EYE OF GOD LOCKDOWN ATIVADO EM TODO O ESTADO (SIMULAÇÃO)!', 'error');
        pushEventFeed({ text: 'DEFCON 1: Protocolo LOCKDOWN acionado', crit: true });
      } else {
        playTacticalSound(660, 'sine', 0.15, 0.05);
        printTerminal('Protocolo de Lockdown encerrado. DEFCON restaurado para NÍVEL 2 - ELEVADO.', 'success');
        pushEventFeed({ text: 'DEFCON 2: Estado operacional normalizado', crit: false });
      }
    }

    function lockTargetOnRadar() {
      const cam = camerasDB[focusedCamIdx] || camerasDB[0];
      targetLocked = true;
      playTacticalSound(1400, 'sine', 0.15);
      printTerminal(`🎯 MIRA CRAVADA: Coordenadas de ${cam.plate} transmitidas para a viatura ${cam.unit}.`, 'success');
      pushEventFeed({ text: `MIRA TRAVADA: ${cam.plate} -> ${cam.unit}`, crit: true });
      renderTacticalRadar(Date.now());
    }

    function deployInterceptorDrone() {
      droneDispatched = true;
      playTacticalSound(600, 'triangle', 0.2);
      printTerminal('🚁 DRONE DE INTERCEPTAÇÃO DESPACHADO: DRONE-02 em rota (ETA 2 MINUTOS).', 'success');
      pushEventFeed({ text: 'DRONE-02 em deslocamento para acompanhamento', crit: false });
      renderTacticalRadar(Date.now());
    }

    if (lockdownBtn) lockdownBtn.addEventListener('click', () => setLockdown(!lockdownActive));
    if (lockTargetBtn) lockTargetBtn.addEventListener('click', lockTargetOnRadar);
    if (dispatchDroneBtn) dispatchDroneBtn.addEventListener('click', deployInterceptorDrone);

    // ==================== 13. INTERPRETADOR CLI UNIFICADO ====================
    function executeCommand(rawCmd) {
      const trimmed = rawCmd.trim();
      if (!trimmed) return;
      cmdHistory.unshift(trimmed);
      if (cmdHistory.length > 30) cmdHistory.pop();
      historyPos = -1;

      playTacticalSound(1100, 'square', 0.05);
      printTerminal(`root@SPIA-GODS-EYE:~# ${trimmed}`);

      const parts = trimmed.split(/\s+/);
      const main = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ');

      switch (main) {
        case 'help':
          printTerminal(
            'COMANDOS: help, target <nome>, lockdown, standdown, thermal, nvg, lidar, optical, neural, sar, scan, radar, intercept, status, clear | DADOS: pib, pop, fiscal, edu, swot, geo [the|pi], mun <nome>, graph <id>, anomalies, weather, macro, commodities, govbr',
            'success'
          );
          break;
        case 'target': {
          if (arg) {
            const idx = camerasDB.findIndex(
              c => c.plate.toLowerCase().includes(arg.toLowerCase()) ||
                   c.model.toLowerCase().includes(arg.toLowerCase()) ||
                   c.id.toLowerCase() === arg.toLowerCase()
            );
            if (idx >= 0) {
              focusCamera(idx);
              printTerminal(`ALVO SINALIZADO: ${camerasDB[idx].model} [${camerasDB[idx].plate}] em ${camerasDB[idx].loc}.`, 'success');
            } else {
              customTargetLabel = arg;
              updateTargetInspectCard();
              printTerminal(`ALVO SINALIZADO: "${arg}" — rastreamento orbital simulado travado.`, 'success');
            }
          } else {
            const cam = camerasDB[focusedCamIdx];
            printTerminal(`ALVO SINALIZADO: ${cam.model} [${cam.plate}] — satélite GEO-PI-01 travado.`, 'success');
          }
          targetLocked = true;
          playTacticalSound(400, 'sawtooth', 0.18);
          break;
        }
        case 'lockdown': setLockdown(true); break;
        case 'standdown':
        case 'unlock':
        case 'reset': setLockdown(false); break;
        case 'thermal':
        case 'flir': setCameraMode('FLIR'); break;
        case 'nvg': setCameraMode('NVG'); break;
        case 'lidar': setCameraMode('LIDAR'); break;
        case 'optical': setCameraMode('OPTICAL'); break;
        case 'neural': setCameraMode('NEURAL'); break;
        case 'sar': setCameraMode('SAR'); break;
        case 'scan':
          printTerminal('VARREDURA MULTI-SETORIAL: 6 câmeras ativas em Teresina (ZL, CT, ZN, ZSE, ZO) — 100% operacionais (simulação).', 'success');
          pushEventFeed({ text: 'SCAN: Varredura orbital concluída nas 6 zonas', crit: false });
          break;
        case 'radar':
          setMapMode('RADAR');
          printTerminal('RADAR C4ISR: 12 alvos monitorados · 8 viaturas em campo · varredura 360° ativa.', 'success');
          break;
        case 'geo': {
          const targetLayer = arg.toLowerCase() === 'pi' ? 'GEO-PI' : 'GEO-THE';
          setMapMode(targetLayer);
          printTerminal(`CAMADA GIS ATIVA: ${targetLayer} (projeção WGS84 carregada no painel tático).`, 'success');
          break;
        }
        case 'pib':
          printTerminal('PIB PIAUÍ (IBGE 2023): R$ 80,9 bilhões (+4,2% a.a.) | Teresina: R$ 28,2 bi (2023) | Agro: 18% (destaque Sudoeste/MATOPIBA).', 'success');
          break;
        case 'pop':
          printTerminal('POPULAÇÃO (IBGE): Censo 2022 = 3.271.199 hab. (PI) / 866.300 (Teresina, 26,48%) | Est. 2025 = 3.384.547 (PI) / 905.692 (Teresina, 26,76%).', 'success');
          break;
        case 'fiscal':
          printTerminal('FISCAL (SEFAZ-PI 2025): DCL R$ 10,93 bi (56,1% da RCL 2025 de R$ 19,5 bi · 61% RGF anterior) · Limite LRF Senado = 200% | CAPAG-STN: B.', 'success');
          break;
        case 'weather': {
          const rt = window.PiauiRealtime ? window.PiauiRealtime.getState() : null;
          if (rt && rt.weather && rt.weather.teresina && rt.weather.teresina.tempC != null) {
            const hubs = [
              `Teresina: ${Number(rt.weather.teresina.tempC).toFixed(1)}°C (Umid. ${rt.weather.teresina.humidity ?? '—'}% · UV ${rt.weather.teresina.uv ?? '—'})`,
              rt.weather.parnaiba ? `Parnaíba: ${Number(rt.weather.parnaiba.tempC).toFixed(1)}°C` : null,
              rt.weather.picos ? `Picos: ${Number(rt.weather.picos.tempC).toFixed(1)}°C` : null,
              rt.weather.bomJesus ? `Bom Jesus: ${Number(rt.weather.bomJesus.tempC).toFixed(1)}°C` : null
            ].filter(Boolean);
            printTerminal('CLIMA PIAUÍ (Open-Meteo): ' + hubs.join(' | '), 'success');
          } else {
            printTerminal('CLIMA PIAUÍ: Telemetria local aguardando sincronização Open-Meteo (execute "govbr").', 'sys');
          }
          break;
        }
        case 'macro': {
          const rt = window.PiauiRealtime ? window.PiauiRealtime.getState() : null;
          if (rt && rt.bcb && rt.bcb.selic && rt.bcb.selic.valor != null) {
            const parts = [`Selic Meta: ${rt.bcb.selic.valor}% (${rt.bcb.selic.data || 'atual'})`];
            if (rt.bcb.ipca && rt.bcb.ipca.valor != null) parts.push(`IPCA Mês: ${rt.bcb.ipca.valor}%`);
            if (rt.bcb.usdBrl && rt.bcb.usdBrl.valor != null) parts.push(`USD PTAX: R$ ${rt.bcb.usdBrl.valor}`);
            printTerminal('MACRO BCB SGS: ' + parts.join(' | '), 'success');
          } else {
            printTerminal('MACRO BCB SGS: Sem leitura ao vivo na sessão (execute "govbr" com rede ativa).', 'sys');
          }
          break;
        }
        case 'commodities':
        case 'petroleo':
        case 'oil': {
          const rt = window.PiauiRealtime ? window.PiauiRealtime.getState() : null;
          const comm = rt && rt.commodities ? rt.commodities : { icbr: {}, quotes: {} };
          const q = comm.quotes || {};
          const icbr = comm.icbr || {};
          const pieces = [];
          if (q.brent && typeof q.brent.price === 'number') pieces.push(`Brent: US$ ${q.brent.price.toFixed(2)}/bbl`);
          if (q.wti && typeof q.wti.price === 'number') pieces.push(`WTI: US$ ${q.wti.price.toFixed(2)}/bbl`);
          if (q.soja && typeof q.soja.price === 'number') pieces.push(`Soja CBOT: US$ ${(q.soja.price / 100).toFixed(2)}/bu`);
          if (q.milho && typeof q.milho.price === 'number') pieces.push(`Milho CBOT: US$ ${(q.milho.price / 100).toFixed(2)}/bu`);
          if (icbr.total && icbr.total.valor != null) pieces.push(`IC-Br Total: ${icbr.total.valor}`);
          if (icbr.energia && icbr.energia.valor != null) pieces.push(`IC-Br Energia: ${icbr.energia.valor}`);
          if (pieces.length) {
            printTerminal('COMMODITIES & PETRÓLEO: ' + pieces.join(' | '), 'success');
          } else {
            printTerminal('COMMODITIES & PETRÓLEO: Aguardando sync OSINT/BCB IC-Br (ver aba Econômica ou execute "govbr").', 'sys');
          }
          break;
        }
        case 'edu':
          printTerminal('EDUCAÇÃO (INEP/SEDUC): IDEB Ensino Médio 2023 = 4,5 (4º lugar no Brasil, melhor do Nordeste) | IDEP/IDEPI monitorados.', 'success');
          break;
        case 'swot':
          printTerminal('SWOT PIAUÍ: Forças (Energia limpa/IDEB/Solidez fiscal) | Oportunidades (H2V ZPE Parnaíba/MATOPIBA/Transnordestina) | Riscos (Seca/Concentração/Saneamento).', 'success');
          break;
        case 'anomalies':
          if (ontology && ontology.anomalies) {
            ontology.anomalies.forEach(a => printTerminal(`[${a.severity.toUpperCase()}] ${a.title}: ${a.detail}`, 'sys'));
          } else {
            printTerminal('Módulo ontology.js não carregado.', 'error');
          }
          break;
        case 'mun': {
          const normText = str => String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
          const q = normText(arg.trim());
          if (!q) {
            printTerminal('Uso: mun <nome ou código IBGE>. Ex: mun parnaiba, mun urucui', 'error');
            break;
          }
          const hub = ontology && ontology.municipalities.find(m =>
            normText(m.name).includes(q) || String(m.ibge || '') === q
          );
          if (hub) {
            setMapMode('GEO-PI');
            printTerminal(`${hub.name} (IBGE ${hub.ibge}): Pop. Censo 2022 = ${hub.pop2022.toLocaleString('pt-BR')} · Território: ${hub.territory} · Coord: ${hub.lat}, ${hub.lon} · ${hub.role}`, 'success');
          } else {
            const rt = window.PiauiRealtime ? window.PiauiRealtime.getState() : null;
            const liveHit = rt && rt.ibge && Array.isArray(rt.ibge.municipios)
              ? rt.ibge.municipios.find(m => normText(m.nome).includes(q))
              : null;
            if (liveHit) {
              printTerminal(`${liveHit.nome} (IBGE ${liveHit.id}) — município oficial do Piauí validado via IBGE Localidades API.`, 'success');
            } else {
              printTerminal(`Município "${arg}" não encontrado nos 16 polos locais (use "govbr" para indexar todos os 224 via IBGE).`, 'error');
            }
          }
          break;
        }
        case 'graph': {
          const targetId = (arg || 'PI').toUpperCase();
          if (ontology && ontology.ontologyGraph.nodes.some(n => n.id === targetId)) {
            updateNodeInspector(targetId);
            renderPalantirGraph(Date.now());
            printTerminal(`Grafo centralizado no nó [${targetId}].`, 'success');
          } else {
            const ids = ontology ? ontology.ontologyGraph.nodes.map(n => n.id).join(', ') : '';
            printTerminal(`Nó "${arg}" desconhecido. Nós disponíveis: ${ids}`, 'error');
          }
          break;
        }
        case 'govbr':
          if (window.PiauiRealtime) {
            printTerminal('Consultando IBGE, Banco Central SGS, Open-Meteo e SICONFI…', 'sys');
            window.PiauiRealtime.syncAll().then(res => {
              printTerminal(`Sincronização Gov-BR concluída [${res.modeLabel}].`, 'success');
            });
          } else {
            printTerminal('Módulo realtime-gov.js indisponível.', 'error');
          }
          break;
        case 'intercept':
          lockTargetOnRadar();
          deployInterceptorDrone();
          break;
        case 'clear':
          if (termBody) termBody.replaceChildren();
          break;
        case 'status':
          printTerminal(
            `SISTEMA ESTÁVEL [MODO ${activeCamMode} · GIS ${activeMapMode}]: 6 CÂMERAS // 8 VIATURAS // DEFCON ${lockdownActive ? '1 (CRÍTICO)' : '2 (ELEVADO)'}`,
            'success'
          );
          break;
        default:
          printTerminal(`Comando desconhecido: '${trimmed}'. Digite 'help'.`, 'error');
          break;
      }
    }

    if (termInput) {
      termInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          const cmd = termInput.value;
          termInput.value = '';
          executeCommand(cmd);
        } else if (event.key === 'ArrowUp' && cmdHistory.length) {
          event.preventDefault();
          historyPos = Math.min(historyPos + 1, cmdHistory.length - 1);
          termInput.value = cmdHistory[historyPos];
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          if (historyPos > 0) {
            historyPos--;
            termInput.value = cmdHistory[historyPos];
          } else {
            historyPos = -1;
            termInput.value = '';
          }
        }
      });
    }

    // ==================== 14. LOOP DE RENDERIZAÇÃO ====================
    function renderAllFrames(nowMs) {
      renderMatrixRain();
      renderCCTVFeeds(nowMs);
      renderWireframeFace(nowMs);
      renderTacticalRadar(nowMs);
      renderPalantirGraph(nowMs);
      renderSpectrum(nowMs);
    }

    function isTabActive() {
      return tabPanel.classList.contains('active') && !document.hidden;
    }

    function animationStep() {
      if (!isTabActive()) {
        rafId = null;
        return;
      }
      renderAllFrames(Date.now());
      if (!reducedMotion && typeof window.requestAnimationFrame === 'function') {
        rafId = window.requestAnimationFrame(animationStep);
      } else {
        rafId = null;
      }
    }

    function startActiveLoops() {
      resizeMatrixRain();
      syncRealtimeSensors();
      updateTacticalClock();
      renderAllFrames(Date.now());

      if (!clockTimer) {
        clockTimer = window.setInterval(() => {
          if (isTabActive()) updateTacticalClock();
        }, reducedMotion ? 1000 : 80);
      }
      if (!eventTimer) {
        eventTimer = window.setInterval(() => {
          if (isTabActive()) {
            pushEventFeed(sampleEvents[Math.floor(Math.random() * sampleEvents.length)]);
          }
        }, 5500);
      }
      if (!rafId && !reducedMotion && typeof window.requestAnimationFrame === 'function') {
        rafId = window.requestAnimationFrame(animationStep);
      }
    }

    function stopActiveLoops() {
      if (rafId && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    buildCameraGrid();
    updateTargetInspectCard();
    updateNodeInspector(selectedNodeId);
    syncRealtimeSensors();
    updateTacticalClock();

    window.addEventListener('resize', () => {
      if (isTabActive()) resizeMatrixRain();
    });

    document.addEventListener('visibilitychange', () => {
      if (isTabActive()) startActiveLoops();
      else stopActiveLoops();
    });

    document.addEventListener('dashboard:tabchange', event => {
      if (event.detail === 'eye-of-god') startActiveLoops();
      else stopActiveLoops();
    });

    if (tabPanel.classList.contains('active')) {
      startActiveLoops();
    }
  }

  window.mountEyeOfGod = mountEyeOfGod;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEyeOfGod, { once: true });
  } else {
    initEyeOfGod();
  }
})();
