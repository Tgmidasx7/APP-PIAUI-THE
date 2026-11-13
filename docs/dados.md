# Governança de dados (v2)

O painel apresenta indicadores sobre população, território, PIB, educação, finanças públicas e desenvolvimento humano do Piauí e de Teresina, estruturados em `assets/ontology.js` e complementados por consultas diretas às APIs públicas Gov-BR (`assets/realtime-gov.js`) e pelo snapshot OSINT gerado via GitHub Actions (`data/piaui-live.json`).

## Inventário e rastreabilidade

Na v2, o catálogo de indicadores em `assets/ontology.js` registra para cada série:

- Nome, domínio e abrangência geográfica (`Piauí` ou `Teresina`).
- Valor, unidade, período de referência e classificação (`oficial`, `estimativa`, `auditado_painel` ou `a_verificar`).
- Instituição responsável, link primário e notas metodológicas (ex.: distinção entre DCL/RCL 2025 direta de `56,1%` e `61%` sobre RCL anterior de `R$ 17,92 bi`, e entre taxa intercensitária 2010–2022 e variação recente de estimativas 2022–2025).

A aba **Fontes & método** exibe dinamicamente a matriz completa de indicadores a partir da ontologia.

## Processo de atualização

1. Atualizar séries anuais estruturais em `assets/ontology.js` e sincronizar os cartões correspondentes em `index.html`.
2. Garantir coerência entre gráficos (`initCharts()`) e notas metodológicas (`chartNotes` em `assets/dashboard.js`).
3. Executar `npm test` (suítes Python `unittest` e Node `JSDOM`) antes de abrir pull request para `main`.
4. Deixar a coleta dinâmica de clima, BCB SGS, IBGE e feeds sob responsabilidade de `assets/realtime-gov.js` e `.github/workflows/osint-sync.yml`, sem credenciais privadas no repositório.

## Curadoria de notícias, Educação e módulo SPIA

A seleção inicial de `assets/news.js` reúne 50 publicações com links, datas, fontes e categorias. Na execução v2, o Terminal combina automaticamente o snapshot `data/piaui-live.json`, notícias oficiais da Agência IBGE e consulta de feeds RSS, mantendo a curadoria local disponível offline.

No módulo **Educacional**, os dados quantitativos por escola (27 unidades catalogadas com código INEP em `assets/ontology.js`, divididas por zonas de Teresina e polos do interior) seguem estritamente divulgações anuais/bienais do **Censo Escolar INEP (2024–2026)** e do **IDEB 2023**, sem geração artificial de contagens ao vivo. Já a camada dinâmica em tempo real consulta notícias da **SEDUC-PI (RSS)**, **Agência IBGE Educação**, o snapshot OSINT (`data/piaui-live.json`) e o monitoramento climático escolar (Open-Meteo).

Nos módulos **Segurança Pública** e **EdTech & IA**, os indicadores consolidam séries oficiais da **SSP-PI / DataSSP (2022–2026)**, **CellGuard**, **Pacto pela Ordem**, **Piauí IA (UNESCO)**, **PIT**, **Seduckathon** e **ZPE Parnaíba**, com coleta complementar de notícias via feed RSS oficial da **SSP-PI** em `scripts/sync_osint.mjs`.

A edição paralela **Teresina Capital (`/teresina/`)** utiliza os dados municipais auditados de `PIAUI_ONTOLOGY.teresinaCapital` (**IBGE Censo 2022 por subdistrito e favelas urbanas**, **SICONFI `id_ente=2211001`**, **LOA 2025**, **Novo Caged 2025**, **SUS municipal** e as **24 escolas reais da capital**).

A aba **SPIA Piauí** utiliza 30 vídeos públicos identificados pelo local verdadeiro, e o painel **Eye of God** integra mapa GIS real (WGS84), grafo ontológico e telemetria Gov-BR com câmeras e biometria ilustrativas sem acesso a sistemas policiais.

