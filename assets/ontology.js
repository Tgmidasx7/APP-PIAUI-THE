/**
 * ONTOLOGIA ESTRUTURADA — PIAUÍ TERESINA ANALYTICS (PADRÃO GOV-BR / FOUNDRY)
 * Fonte única local de entidades, indicadores, coordenadas geográficas reais e vínculos.
 * Funciona offline/file:// e é enriquecida em tempo real por assets/realtime-gov.js.
 */
window.PIAUI_ONTOLOGY = {
  version: '2.0.0',
  uf: { code: 22, sigla: 'PI', name: 'Piauí', capitalCode: 2211001, capital: 'Teresina' },
  baseline: {
    populacaoPI2022: 3271199,
    populacaoPI2025Est: 3384547,
    populacaoTER2022: 866300,
    populacaoTER2025Est: 905692,
    pibPI2023Bi: 80.9,
    pibRealGrowth2023Pct: 4.2,
    pibPerCapitaPI: 24736,
    pibPerCapitaTER: 33994,
    pibPerCapitaDiffPct: 37.4,
    receitaBruta2024Bi: 25.54,
    despesaEmpenhada2024Bi: 22.93,
    receitaBruta2025Bi: 21.60,
    receitaCorrente2025Bi: 19.5,
    despesaCorrente2025Bi: 18.19,
    dcl2025Bi: 10.93,
    dclSobreRclPct: 56.05,
    dclSobreRclRefAnteriorPct: 61.0,
    dclVariacaoPct: 30.65,
    despesaPessoalPct: 38.77,
    lrfPessoalLimitePct: 49.0,
    lrfDividaLimitePct: 200.0,
    educacaoRclPct: 24.75,
    saudeRclPct: 14.34,
    gini2023: 0.552,
    idh2021: 0.690,
    idhmTeresina2010: 0.751
  },
  indicators: [
    {
      id: 'geo-area-pi',
      domain: 'Geográfica',
      entity: 'Piauí',
      label: 'Área territorial do Piauí',
      value: '251.755 km²',
      numericValue: 251755,
      unit: 'km²',
      period: '2022',
      status: 'oficial',
      sourceName: 'IBGE Cidades',
      sourceUrl: 'https://www.ibge.gov.br/cidades-e-estados/pi.html',
      note: '11º maior estado do Brasil; 224 municípios.'
    },
    {
      id: 'demo-pop-censo-pi',
      domain: 'Demográfica',
      entity: 'Piauí',
      label: 'População residente (Censo 2022)',
      value: '3.271.199 hab.',
      numericValue: 3271199,
      unit: 'habitantes',
      period: '2022',
      status: 'censo',
      sourceName: 'IBGE Censo 2022',
      sourceUrl: 'https://censo2022.ibge.gov.br/',
      note: 'Taxa geométrica intercensitária 2010–2022: +0,26% a.a.'
    },
    {
      id: 'demo-pop-est-pi',
      domain: 'Demográfica',
      entity: 'Piauí',
      label: 'População estimada (2025)',
      value: '3.384.547 hab.',
      numericValue: 3384547,
      unit: 'habitantes',
      period: '2025',
      status: 'estimativa',
      sourceName: 'IBGE Estimativas Populacionais',
      sourceUrl: 'https://www.ibge.gov.br/cidades-e-estados/pi.html',
      note: 'Variação implícita 2022→2025 nos valores exibidos: +3,47% (+1,14% a.a.). Não confundir com taxa 2010–2022.'
    },
    {
      id: 'demo-pop-ter-est',
      domain: 'Demográfica',
      entity: 'Teresina',
      label: 'População de Teresina (Est. 2025)',
      value: '905.692 hab.',
      numericValue: 905692,
      unit: 'habitantes',
      period: '2025',
      status: 'estimativa',
      sourceName: 'IBGE Cidades — Teresina',
      sourceUrl: 'https://www.ibge.gov.br/cidades-e-estados/pi/teresina.html',
      note: 'Censo 2022: 866.300 hab. Participação atual sobre o total estadual: 26,76%.'
    },
    {
      id: 'eco-pib-pi',
      domain: 'Econômica',
      entity: 'Piauí',
      label: 'PIB Estadual (2023)',
      value: 'R$ 80,9 bi',
      numericValue: 80.9,
      unit: 'R$ bilhões',
      period: '2023',
      status: 'a_verificar',
      sourceName: 'IBGE / Seplan-PI (Contas Regionais)',
      sourceUrl: 'https://www.ibge.gov.br/explica/pib.php',
      note: 'Serviços representam ~71,7% do valor adicionado; detalhamento de Agro/Indústria no gráfico usa proporções ilustrativas.'
    },
    {
      id: 'eco-dcl-pi',
      domain: 'Fiscal',
      entity: 'Piauí',
      label: 'Dívida Consolidada Líquida (DCL)',
      value: 'R$ 10,93 bi (56,1% s/ RCL R$ 19,5 bi · 61% ref. ant.)',
      numericValue: 10.93,
      unit: 'R$ bilhões',
      period: '2025',
      status: 'auditado_painel',
      sourceName: 'SEFAZ-PI / SICONFI Tesouro Nacional',
      sourceUrl: 'https://www.gov.br/tesouronacional/pt-br',
      note: 'Razão direta R$ 10,93 bi / R$ 19,50 bi = 56,05% (61% referia-se à RCL anualizada anterior de R$ 17,92 bi). Abaixo do teto LRF (200%), mas alta de +30,65% requer monitoramento.'
    },
    {
      id: 'eco-lrf-pessoal',
      domain: 'Fiscal',
      entity: 'Piauí',
      label: 'Despesa com Pessoal / RCL (LRF)',
      value: '38,77%',
      numericValue: 38.77,
      unit: '% RCL',
      period: '2025',
      status: 'a_verificar',
      sourceName: 'SEFAZ-PI / RGF',
      sourceUrl: 'https://www.sefaz.pi.gov.br/',
      note: 'Limite máximo do Executivo na LRF: 49% (limite prudencial: 46,55%; alerta: 44,10%).'
    },
    {
      id: 'edu-ideb-em',
      domain: 'Educacional',
      entity: 'Piauí',
      label: 'IDEB Ensino Médio (2023)',
      value: '4,5',
      numericValue: 4.5,
      unit: 'nota 0–10',
      period: '2023',
      status: 'oficial',
      sourceName: 'INEP / MEC',
      sourceUrl: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb',
      note: '4º lugar nacional e 1º do Nordeste no ciclo divulgado (2021: 4,2).'
    },
    {
      id: 'idh-pi-2021',
      domain: 'Desenvolvimento Humano',
      entity: 'Piauí',
      label: 'IDH Estadual (2021)',
      value: '0,690',
      numericValue: 0.690,
      unit: 'índice 0–1',
      period: '2021',
      status: 'a_verificar',
      sourceName: 'PNUD Brasil / AtlasDH',
      sourceUrl: 'https://www.undp.org/pt/brazil',
      note: 'IDH estadual (0,690 em 2021) não deve ser comparado diretamente ao IDHM municipal de Teresina (0,751 em 2010) sem ajuste de série.'
    },
    {
      id: 'idh-gini-2023',
      domain: 'Desenvolvimento Humano',
      entity: 'Piauí',
      label: 'Índice de Gini (Renda)',
      value: '0,552',
      numericValue: 0.552,
      unit: 'índice 0–1',
      period: '2023',
      status: 'a_verificar',
      sourceName: 'IBGE PNAD Contínua',
      sourceUrl: 'https://www.ibge.gov.br/',
      note: 'Desigualdade elevada com tendência de alta pós-2012.'
    }
  ],
  anomalies: [
    {
      id: 'alert-dcl-growth',
      severity: 'warn',
      title: 'Aceleração da Dívida Consolidada Líquida (+30,65% em 2025)',
      detail: 'DCL (R$ 10,93 bi) equivale a 56,1% da RCL 2025 (R$ 19,5 bi) e 61% da RCL anterior (R$ 17,92 bi) — abaixo do limite LRF (200%), mas o ritmo frente à Selic exige controle.'
    },
    {
      id: 'alert-lrf-folga',
      severity: 'ok',
      title: 'Margem fiscal na Despesa de Pessoal (38,77% vs teto 49%)',
      detail: 'Folga de 10,23 pontos percentuais abaixo do limite legal da LRF e aplicação de 24,75% (Educação) e 14,34% (Saúde).'
    },
    {
      id: 'alert-gini-desigualdade',
      severity: 'crit',
      title: 'Desigualdade de renda persistente (Gini 0,552) e concentração em 14 municípios',
      detail: '50,1% da população concentra-se em 14 municípios e Teresina tem PIB per capita 37,4% superior à média estadual.'
    },
    {
      id: 'alert-method-series',
      severity: 'info',
      title: 'Divergências metodológicas identificadas na auditoria do painel',
      detail: 'Separar taxa intercensitária (0,26% 2010–2022) da variação 2022–2025, despesas empenhadas (2024) de despesas correntes (2025) e IDH estadual de IDHM municipal.'
    }
  ],
  // Polígono simplificado do contorno do Estado do Piauí [lat, lon]
  piauiPolygon: [
    [-2.74, -41.78], [-2.88, -41.32], [-3.42, -41.22], [-4.22, -41.40],
    [-4.95, -40.98], [-5.62, -40.76], [-6.68, -40.58], [-7.42, -40.42],
    [-8.32, -40.82], [-9.28, -41.58], [-10.12, -42.75], [-10.82, -44.20],
    [-10.90, -45.15], [-10.30, -45.92], [-9.55, -45.88], [-8.80, -45.55],
    [-8.12, -45.60], [-7.45, -45.32], [-6.75, -44.82], [-6.18, -43.95],
    [-5.55, -42.98], [-5.09, -42.82], [-4.32, -42.88], [-3.58, -42.42],
    [-2.95, -42.10], [-2.74, -41.78]
  ],
  // Principais municípios e polos do Piauí com coordenadas reais (WGS84)
  municipalities: [
    { ibge: '2211001', name: 'Teresina', lat: -5.0892, lon: -42.8016, pop2022: 866300, territory: 'Entre Rios', role: 'Capital · Polo serviços, saúde e educação', priority: 'hub' },
    { ibge: '2207702', name: 'Parnaíba', lat: -2.9055, lon: -41.7754, pop2022: 162159, territory: 'Planície Litorânea', role: 'Litoral · ZPE, turismo (Delta) e comércio', priority: 'hub' },
    { ibge: '2208007', name: 'Picos', lat: -7.0769, lon: -41.4669, pop2022: 83090, territory: 'Vale do Rio Guaribas', role: 'Entroncamento centro-sul · Comércio e apicultura', priority: 'hub' },
    { ibge: '2208403', name: 'Piripiri', lat: -4.2733, lon: -41.7769, pop2022: 65538, territory: 'Cocais', role: 'Norte · Acesso a Sete Cidades e serviços', priority: 'polo' },
    { ibge: '2203909', name: 'Floriano', lat: -6.7669, lon: -43.0225, pop2022: 62036, territory: 'Vale dos Rios Piauí e Itaueira', role: 'Centro-sul · Comércio, saúde e divisa MA', priority: 'polo' },
    { ibge: '2201507', name: 'Barras', lat: -4.2444, lon: -42.2944, pop2022: 47938, territory: 'Cocais', role: 'Norte · Bacia do Longá e agropecuária', priority: 'polo' },
    { ibge: '2202208', name: 'Campo Maior', lat: -4.8278, lon: -42.1686, pop2022: 45793, territory: 'Carnaubais', role: 'Carnaubais · Pecuária e extrativismo', priority: 'polo' },
    { ibge: '2211100', name: 'União', lat: -4.5858, lon: -42.8642, pop2022: 46119, territory: 'Entre Rios', role: 'Grande Teresina · Agroindústria', priority: 'polo' },
    { ibge: '2200400', name: 'Altos', lat: -5.0397, lon: -42.4606, pop2022: 47453, territory: 'Entre Rios', role: 'Eixo BR-343 · Integração metropolitana', priority: 'polo' },
    { ibge: '2207009', name: 'Oeiras', lat: -7.0253, lon: -42.1311, pop2022: 38161, territory: 'Vale do Canindé', role: 'Primeira capital · Patrimônio histórico e serviços', priority: 'polo' },
    { ibge: '2209906', name: 'São Raimundo Nonato', lat: -9.0153, lon: -42.6994, pop2022: 38934, territory: 'Serra da Capivara', role: 'Turismo científico (PARNA Serra da Capivara)', priority: 'polo' },
    { ibge: '2201903', name: 'Bom Jesus', lat: -9.0744, lon: -44.3586, pop2022: 28796, territory: 'Chapada das Mangabeiras', role: 'MATOPIBA · Agronegócio de grãos e soja', priority: 'hub' },
    { ibge: '2211209', name: 'Uruçuí', lat: -7.2294, lon: -44.5561, pop2022: 25203, territory: 'Tabuleiros do Alto Parnaíba', role: 'MATOPIBA · Fronteira agrícola e logística', priority: 'hub' },
    { ibge: '2205706', name: 'Luís Correia', lat: -2.8789, lon: -41.6669, pop2022: 30641, territory: 'Planície Litorânea', role: 'Litoral · Porto de Luís Correia e ZPE/H2V', priority: 'polo' },
    { ibge: '2207900', name: 'Pedro II', lat: -4.4247, lon: -41.4586, pop2022: 37894, territory: 'Cocais', role: 'Serra · Opala, ecoturismo e clima ameno', priority: 'polo' },
    { ibge: '2206050', name: 'Lagoa do Barro / Curral Novo', lat: -8.4786, lon: -41.5256, pop2022: 10500, territory: 'Serra da Capivara / Chapada do Araripe', role: 'Energia limpa · Complexos eólicos e solares', priority: 'energia' }
  ],
  // Malha geoespacial real simplificada de Teresina [lat, lon]
  teresinaGeo: {
    bounds: { minLat: -5.16, maxLat: -5.01, minLon: -42.86, maxLon: -42.73 },
    rioParnaiba: [
      [-5.16, -42.838], [-5.13, -42.830], [-5.105, -42.825], [-5.089, -42.821],
      [-5.068, -42.824], [-5.045, -42.835], [-5.015, -42.842]
    ],
    rioPoti: [
      [-5.155, -42.742], [-5.130, -42.762], [-5.102, -42.780], [-5.082, -42.796],
      [-5.065, -42.810], [-5.045, -42.835]
    ],
    corridors: [
      { name: 'Av. Frei Serafim', points: [[-5.0895, -42.819], [-5.0878, -42.802], [-5.0845, -42.786]] },
      { name: 'Av. Raul Lopes', points: [[-5.095, -42.797], [-5.084, -42.798], [-5.072, -42.799]] },
      { name: 'Eixo Norte (Duque / Mocambinho)', points: [[-5.084, -42.815], [-5.055, -42.818], [-5.028, -42.820]] },
      { name: 'Eixo Sudeste (Dirceu / BR-343)', points: [[-5.092, -42.785], [-5.108, -42.768], [-5.125, -42.752]] }
    ],
    points: [
      { id: 'CAM-01', name: 'Pte. Estaiada / Av. Raul Lopes', zone: 'ZL', lat: -5.0812, lon: -42.7985, type: 'camera' },
      { id: 'CAM-02', name: 'Av. Frei Serafim / São Benedito', zone: 'CT', lat: -5.0882, lon: -42.8065, type: 'camera' },
      { id: 'CAM-03', name: 'Terminal Mocambinho (Norte)', zone: 'ZN', lat: -5.0338, lon: -42.8182, type: 'camera' },
      { id: 'CAM-04', name: 'Grande Dirceu / Av. Principal', zone: 'ZSE', lat: -5.1118, lon: -42.7642, type: 'camera' },
      { id: 'CAM-05', name: 'Ponte Metálica / Divisa Timon', zone: 'ZO', lat: -5.0925, lon: -42.8225, type: 'camera' },
      { id: 'CAM-06', name: 'Aeroporto Sen. Petrônio Portella', zone: 'ZN', lat: -5.0598, lon: -42.8236, type: 'camera' },
      { id: 'TOTEM-01', name: 'Totem Inteligente SSP-PI (Centro)', zone: 'CT', lat: -5.0894, lon: -42.8118, type: 'totem' },
      { id: 'SUB-THE2', name: 'Subestação Teresina II (Grid 60Hz)', zone: 'ZSE', lat: -5.1210, lon: -42.7790, type: 'infra' }
    ]
  },
  // Grafo de Entidades Reais do Piauí (Palantir Gotham Ontology View)
  ontologyGraph: {
    nodes: [
      { id: 'PI', label: 'Estado do Piauí', group: 'geo', detail: '251.755 km² · 224 municípios · 3,27M hab (Censo 2022)', color: '#00ff66' },
      { id: 'TER', label: 'Teresina (Capital)', group: 'geo', detail: '866,3 mil hab (2022) · 26,76% da pop. · PIB/cap R$ 33.994', color: '#00f0ff' },
      { id: 'MATOPIBA', label: 'MATOPIBA (Soja)', group: 'eco', detail: 'Bom Jesus & Uruçuí · Fronteira agrícola de grãos', color: '#ffd700' },
      { id: 'ENERGIA', label: 'Eólica / Solar / H2V', group: 'eco', detail: '95% matriz renovável · Potencial Hidrogênio Verde', color: '#00ff66' },
      { id: 'PORTO', label: 'Porto Luís Correia', group: 'infra', detail: 'Litoral Norte / ZPE Parnaíba · Escoamento H2V & grãos', color: '#00f0ff' },
      { id: 'FISCAL', label: 'SEFAZ / LRF / DCL', group: 'fiscal', detail: 'DCL R$ 10,93 bi (56,1% RCL 2025 · 61% ref. ant., +30,65%) · Pessoal 38,77%', color: '#ff003c' },
      { id: 'SEDUC', label: 'IDEB / Tempo Integral', group: 'social', detail: 'EM 4,5 (4º Brasil / 1º NE) · 100% Tempo Integral', color: '#00ff66' },
      { id: 'GINI', label: 'Desigualdade (Gini)', group: 'social', detail: 'Gini 0,552 (2023) · 50,1% pop. em 14 municípios', color: '#ff8c00' },
      { id: 'SPIA', label: 'Segurança / SPIA', group: 'sec', detail: 'Totens inteligentes SSP-PI · Monitoramento urbano', color: '#00f0ff' }
    ],
    edges: [
      ['PI', 'TER', 'capital / 26,8% pop.'],
      ['PI', 'MATOPIBA', 'agroexportação'],
      ['PI', 'ENERGIA', '95% limpa'],
      ['PI', 'FISCAL', 'gestão LRF'],
      ['PI', 'SEDUC', 'capital humano'],
      ['TER', 'GINI', 'concentração urbana'],
      ['TER', 'SPIA', 'cerco Teresina'],
      ['ENERGIA', 'PORTO', 'exportação H2V'],
      ['MATOPIBA', 'PORTO', 'escoamento'],
      ['FISCAL', 'ENERGIA', 'investimentos / PPPs'],
      ['SEDUC', 'GINI', 'mobilidade social'],
      ['FISCAL', 'SEDUC', '24,75% RCL']
    ]
  },
  // Metadados de Commodities, Petróleo e Índices IC-Br relevantes ao Piauí
  commoditiesMeta: [
    {
      id: 'brent',
      symbol: 'BZ=F',
      name: 'Petróleo Brent',
      unit: 'USD/barril',
      category: 'Energia & Logística',
      piauiLink: 'Pressiona diesel e frete rodoviário: mais de 90% das cargas do MATOPIBA e abastecimento de Teresina dependem de rodovias.'
    },
    {
      id: 'wti',
      symbol: 'CL=F',
      name: 'Petróleo WTI',
      unit: 'USD/barril',
      category: 'Energia & Combustíveis',
      piauiLink: 'Referência norte-americana que acompanha ciclos globais de refino, fertilizantes nitrogenados e custos de transporte.'
    },
    {
      id: 'soja',
      symbol: 'ZS=F',
      name: 'Soja (CBOT)',
      unit: 'USc/bushel',
      category: 'Agronegócio (MATOPIBA)',
      piauiLink: 'Principal produto agroexportador do Sudoeste piauiense (Uruçuí, Bom Jesus, Baixa Grande do Ribeiro); 1 saca 60 kg ≈ 2,2046 bushels.'
    },
    {
      id: 'milho',
      symbol: 'ZC=F',
      name: 'Milho (CBOT)',
      unit: 'USc/bushel',
      category: 'Agronegócio & Proteína',
      piauiLink: 'Cultura de 2ª safra nos Cerrados e base de custo para avicultura/suinocultura no estado; 1 saca 60 kg ≈ 2,3621 bushels.'
    },
    {
      id: 'ouro',
      symbol: 'GC=F',
      name: 'Ouro (Spot/Futuro)',
      unit: 'USD/onça troy',
      category: 'Reserva & Mineração',
      piauiLink: 'Termômetro global de aversão ao risco e juros; dialoga com o potencial mineral do estado (níquel, ferro, diamante e fósforo).'
    },
    {
      id: 'gas_natural',
      symbol: 'NG=F',
      name: 'Gás Natural',
      unit: 'USD/MMBtu',
      category: 'Energia & Transição',
      piauiLink: 'Competitividade da matriz elétrica limpa do Piauí (>95% eólica/solar) frente a térmicas fósseis e custos de amônia/H₂ verde.'
    }
  ],
  economicCrossings: [
    {
      id: 'cross-divida-selic',
      tag: 'FISCAL × JUROS',
      title: 'Dívida de R$ 10,93 bi (+30,65%) frente à Selic e folga da LRF',
      plainText: 'Embora a DCL represente 56,1% da RCL de 2025 (61% na referência anterior) — bem abaixo do teto de 200% —, juros altos encarecem novos empréstimos. A proteção vem da despesa de pessoal enxuta (38,77% vs teto 49%), preservando espaço para obras.'
    },
    {
      id: 'cross-pib-desigualdade',
      tag: 'CRESCIMENTO × RENDA',
      title: 'PIB +4,2% real, mas PIB/capita ainda é o 3º menor do Brasil',
      plainText: 'Metade dos piauienses (50,1%) vive em apenas 14 municípios e Teresina tem renda por pessoa 37,4% maior que a média estadual. Sem agroindústria e serviços no interior, o crescimento da soja e da energia nem sempre vira salário local.'
    },
    {
      id: 'cross-petroleo-soja',
      tag: 'PETRÓLEO × SOJA × DÓLAR',
      title: 'Câmbio e soja impulsionam o Sudoeste; diesel limita a margem',
      plainText: 'Dólar alto + soja firme aumentam a receita em reais dos produtores de Bom Jesus e Uruçuí. Porém, sem ferrovia plena até o porto, petróleo caro encarece o diesel dos caminhões e corrói parte do lucro na estrada.'
    },
    {
      id: 'cross-educacao-produtividade',
      tag: 'EDUCAÇÃO × FUTURO',
      title: 'IDEB EM 4,5 (4º do Brasil) buscando conexão com emprego técnico',
      plainText: 'O Piauí investe 24,75% da RCL em Educação e lidera o Nordeste com 100% de tempo integral no Ensino Médio. O salto seguinte é transformar essa base em técnicos para TI (Teresina), H₂ verde (Litoral) e Agro 4.0 (Cerrados).'
    }
  ],
  geoCorridors: [
    {
      id: 'eixo-litoral',
      name: 'Litoral Norte (Parnaíba & Luís Correia)',
      focus: 'Porto, ZPE Parnaíba & Hidrogênio Verde',
      status: 'Em implantação estratégica',
      potentialScore: 92,
      infraScore: 48,
      summary: 'Menor litoral do Brasil (66 km), mas posição atlântica privilegiada para exportar energia renovável convertida em H₂ verde e receber insumos pela ZPE.'
    },
    {
      id: 'eixo-matopiba',
      name: 'Sudoeste MATOPIBA (Uruçuí & Bom Jesus)',
      focus: 'Soja, Milho, Algodão & Transnordestina',
      status: 'Forte expansão exportadora',
      potentialScore: 95,
      infraScore: 56,
      summary: 'Motor agroexportador (18% do PIB crescendo +5,1% a.a.). A ligação ferroviária via Eliseu Martins é decisiva para reduzir a dependência do frete a diesel.'
    },
    {
      id: 'eixo-teresina',
      name: 'Grande Teresina (Entre Rios + Timon-MA)',
      focus: 'Serviços (71,7% PIB), Saúde, Educação & TI',
      status: 'Polo consolidado',
      potentialScore: 84,
      infraScore: 78,
      summary: 'Concentra 26,8% da população e gera PIB per capita R$ 33.994 (+37,4% vs estado). Atua como capital regional médica e universitária do Meio-Norte.'
    },
    {
      id: 'eixo-semiarido',
      name: 'Semiárido Central & Sul (Picos, Lagoa do Barro, S.R. Nonato)',
      focus: 'Eólica, Solar, Minérios & Turismo Científico',
      status: 'Alta geração, baixa retenção industrial',
      potentialScore: 86,
      infraScore: 52,
      summary: 'Gera matriz elétrica >95% limpa e abriga reservas minerais e a Serra da Capivara; o desafio geopolítico é reter indústrias locais e segurança hídrica.'
    }
  ],
  geoCrossMatrix: [
    {
      shock: 'Alta do Petróleo / Diesel (+15%)',
      channel: 'Frete rodoviário & Transporte urbano',
      effect: 'Encarece o escoamento de soja/milho até portos vizinhos e pressiona preços de alimentos em Teresina.',
      buffer: 'Conclusão do ramal da Transnordestina e expansão da frota/matriz elétrica limpa.'
    },
    {
      shock: 'Alta da Soja + Dólar acima de R$ 5,50',
      channel: 'Balança comercial & Renda no MATOPIBA',
      effect: 'Aumenta receita em reais no Sudoeste e faturamento de insumos, máquinas e serviços ligados ao agro.',
      buffer: 'Necessidade de agroindustrialização local (esmagamento/etanol) para espalhar empregos.'
    },
    {
      shock: 'Selic elevada por período prolongado',
      channel: 'Custo da DCL (R$ 10,93 bi) & Crédito MPEs',
      effect: 'Aumenta serviço da dívida estadual (+30,65% em 2025) e trava capital de giro das 185 mil empresas (88,7% micro).',
      buffer: 'Folga na LRF de pessoal (38,77% vs 49%) e captação via PPPs/bancos de desenvolvimento.'
    },
    {
      shock: 'Avanço de H₂ Verde & Data Centers na ZPE',
      channel: 'Energia limpa (>95%) + Porto Luís Correia',
      effect: 'Converte excedente eólico/solar do interior em exportação industrial de alto valor no litoral.',
      buffer: 'Mão de obra formada pela rede estadual (IDEB EM 4,5) e oferta de ensino técnico.'
    },
    {
      shock: 'Oscilação de chuvas / Seca no Semiárido',
      channel: 'Agricultura familiar & Segurança hídrica',
      effect: 'Reduz produtividade fora das áreas irrigadas e aumenta pressão sobre ~650 mil famílias em programas sociais.',
      buffer: 'Obras de adutoras/irrigação, reservação hídrica e geração solar descentralizada.'
    }
  ]
};
