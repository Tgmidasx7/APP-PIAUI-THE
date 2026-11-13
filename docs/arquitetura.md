# Arquitetura e limitações (v2)

## Arquitetura atual

O projeto adota uma arquitetura estática híbrida zero-backend compatível com GitHub Pages e execução local (`python3 -m http.server` ou `file://`):

- **Camada de ontologia e dados auditados (`assets/ontology.js`)**: concentra a base de referência de Piauí e Teresina, catálogo de 10 indicadores com fonte/período/status, 4 registros de anomalias metodológicas, geometria geográfica WGS84 (polígono do Piauí, 16 polos municipais e hidrografia/corredores de Teresina) e grafo ontológico de 9 nós e 12 vínculos.
- **Camada de telemetria Gov-BR & Commodities (`assets/realtime-gov.js`)**: consulta diretamente no navegador APIs públicas brasileiras (IBGE Localidades, IBGE Projeções, IBGE Notícias, Banco Central SGS Selic/IPCA/PTAX/IC-Br 27574–27577, Tesouro Nacional SICONFI, AwesomeAPI fallback e Open-Meteo para clima/UV de Teresina e polos regionais) e consome `data/piaui-live.json` (incluindo Brent, WTI, Soja, Milho, Ouro e Gás Natural) quando servido via HTTP/HTTPS. Em modo offline, mantém fallback determinístico sem quebrar a interface.
- **Pipeline OSINT zero-backend (`scripts/sync_osint.mjs` + `.github/workflows/osint-sync.yml`)**: executa a cada 6 horas no GitHub Actions para atualizar `data/piaui-live.json` diretamente dos feeds RSS oficiais e APIs públicas, eliminando dependência exclusiva de proxies de terceiros.
- **Interface unificada (`index.html`, `eyeofgod/index.html`, `assets/dashboard.js`, `assets/eye-of-god.js`)**: o HUD do *Eye of God* agora é montado a partir de um único componente (`window.mountEyeOfGod`), eliminando duplicação de marcação entre a aba `#eye-of-god` e a rota `/eyeofgod/`. Ambas as páginas aplicam `Content-Security-Policy` e `referrer="no-referrer"`.

## Limitações conhecidas

1. Algumas APIs públicas (como feeds RSS externos ou consultas eventuais ao SICONFI) podem limitar CORS em chamadas diretas do navegador; nesses cenários o painel recorre ao snapshot `data/piaui-live.json` ou aos dados locais auditados.
2. O painel de câmeras C4ISR do *Eye of God* e o módulo SPIA permanecem demonstrativos e sem acesso a câmeras policiais ou dados sigilosos da SSP-PI.
3. Mudanças futuras de indicadores devem atualizar `assets/ontology.js` juntamente com fonte primária, período e unidade.
