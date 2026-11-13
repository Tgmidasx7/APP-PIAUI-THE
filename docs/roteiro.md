# Roteiro de evolução

Este roteiro acompanha a entrega das **Fases 1 e 2** da plataforma (Piauí Teresina Analytics v2) e registra os cuidados contínuos de manutenção.

## Fase 1 — Confiança, segurança, limpeza e rastreabilidade (Concluída)

- [x] Inventariar indicadores e expor matriz dinâmica com fonte primária, período, unidade e status (`assets/ontology.js` + aba `#fontes`).
- [x] Reconciliar divergências metodológicas entre séries (DCL/RCL 2025 de `56,1%` vs `61%` de referência anterior, taxa intercensitária 2010–2022 vs variação de estimativas 2022–2025, execução homogênea 2025, classificação PNUD do IDH 2021 e PIB per capita `+37,4%`).
- [x] Aplicar `Content-Security-Policy` e `referrer="no-referrer"` em `index.html` e `eyeofgod/index.html`, remover CSS legado morto e unificar o HUD *Eye of God* em `window.mountEyeOfGod()`.
- [x] Identificar claramente o ano de referência, o escopo territorial e o link institucional de cada gráfico e tabela acessível.

## Fase 2 — Ontologia, Gov-BR ao vivo, GIS e inteligência analítica (Concluída)

- [x] Criar ontologia estruturada (`assets/ontology.js`), detector automático de anomalias (`#analyticsAnomalies`), simulador What-If da LRF 2025–2030 (`#lrfSimulator`), explorador territorial para os 224 municípios (`#municipalityExplorer`) e exportação de dossiê completo em JSON (`#exportDossier`).
- [x] Integrar APIs públicas Gov-BR no navegador (`assets/realtime-gov.js`: IBGE Localidades/Projeções/Notícias, Banco Central SGS Selic/IPCA/USD, Tesouro SICONFI RGF e Open-Meteo multi-polos) com fallback offline determinístico.
- [x] Implantar coletor OSINT zero-backend em GitHub Actions (`scripts/sync_osint.mjs` + `.github/workflows/osint-sync.yml`) atualizando `data/piaui-live.json` a cada 6 horas.
- [x] Evoluir o *Eye of God* com mapa geoespacial WGS84 clicável (`GEO-THE` / `GEO-PI`), grafo ontológico Palantir interativo e terminal CLI unificado (`pib`, `pop`, `fiscal`, `edu`, `swot`, `geo`, `mun`, `graph`, `anomalies`, `weather`, `macro`, `govbr`).

## Prioridade contínua — manutenção e operação

- [ ] Revisar periodicamente novas divulgações anuais do IBGE, INEP, SEFAZ-PI e PNUD para atualizar `assets/ontology.js`.
- [ ] Registrar uma licença explícita escolhida pelo responsável pelo projeto (`LICENSE`).
- [ ] Acompanhar as execuções de `.github/workflows/osint-sync.yml` e a publicação do GitHub Pages.

