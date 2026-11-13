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
  ],
  // Ecossistema Educacional Estruturado (Censo Escolar 2024-2026 / INEP / SEDUC-PI / SEMEC)
  educationOverview: {
    piauiTotalBasica2024: { escolas: 4143, professores: 46616, matriculas: 829549 },
    piauiPublica2026Prelim: {
      total: 698725,
      municipal: 527365,
      estadual: 171360,
      etapas: {
        infantil: 130902,
        fundIniciais: 194335,
        fundFinais: 157059,
        medio: 106593,
        eja: 109836
      }
    },
    teresinaPublica2026Prelim: {
      total: 126719,
      municipalSemec: 89576,
      estadualSeduc: 37143,
      unidadesSemec2025: 323,
      cmeisSemec2025: 173,
      etapas: {
        infantil: 24411,
        fundIniciais: 38424,
        fundFinais: 30984,
        medio: 21997,
        eja: 10903
      }
    },
    tempoIntegralEpt2025: {
      pctEscolasEstaduaisEm: 100,
      matriculasIntegrais2022: 23812,
      matriculasIntegrais2025: 84474,
      matriculasEptIntegrada2025: 61420,
      pctEptNoEmEstadual: 60,
      icaTeresina2025Pct: 80.58
    }
  },
  educationZones: [
    { id: 'Centro', label: 'Zona Centro (Teresina)', gre: '4ª GRE / Centro-Sul', focus: 'Escolas históricas centenárias, IFPI Central e polos técnicos em Saúde' },
    { id: 'Norte', label: 'Zona Norte (Teresina)', gre: '4ª / 20ª GRE & SEMEC Norte', focus: 'Alta densidade escolar em Mocambinho, Parque Brasil, Santa Maria e São Joaquim' },
    { id: 'Leste', label: 'Zona Leste (Teresina)', gre: '20ª / Zona Rural Leste', focus: 'Turmas olímpicas ITA/IME, ensino integral urbano e destaques municipais rurais' },
    { id: 'Sul', label: 'Zona Sul (Teresina)', gre: '19ª / Sup. Sul', focus: 'Referências de IDEB EM (6,3 em Morada Nova), sistemas e gestão pública' },
    { id: 'Sudeste', label: 'Zona Sudeste (Teresina)', gre: '21ª GRE / Grande Dirceu', focus: 'Maior polo populacional jovem (Dirceu/Novo Horizonte) com forte ensino técnico' },
    { id: 'Interior', label: 'Polos do Interior (PI)', gre: '1ª / 3ª / 9ª GREs', focus: 'Referências estaduais em Cocal dos Alves (OBMEP), Parnaíba (Litoral) e Picos' }
  ],
  schoolsCatalog: [
    {
      inep: '22022376',
      name: 'CETI Zacarias de Góis (Liceu Piauiense)',
      zone: 'Centro',
      municipality: 'Teresina',
      neighborhood: 'Centro (Praça Landri Sales)',
      network: 'Estadual',
      gre: '4ª GRE Centro-Norte',
      stages: ['Ensino Médio', 'Tempo Integral'],
      students: 578,
      teachers: 53,
      idebEf: null,
      idebEm: null,
      courses: 'Ensino Médio Integral (181 anos)',
      award: 'Patrimônio histórico da educação piauiense (0% abandono no Censo 2025)',
      period: 'Censo Escolar 2025'
    },
    {
      inep: '22129553',
      name: 'IFPI — Campus Teresina Central',
      zone: 'Centro',
      municipality: 'Teresina',
      neighborhood: 'Centro (Rua da Liberdade)',
      network: 'Federal',
      gre: 'Rede Federal (IFPI)',
      stages: ['Ensino Médio', 'Técnico Integrado', 'EJA'],
      students: 1663,
      teachers: 255,
      idebEf: null,
      idebEm: null,
      courses: 'Cursos Técnicos Integrados & EJA',
      award: 'Maior polo federal técnico integrado na capital',
      period: 'Censo Escolar 2025'
    },
    {
      inep: '22025324',
      name: 'CETI Prefeito João Mendes Olímpio de Melo',
      zone: 'Centro',
      municipality: 'Teresina',
      neighborhood: 'Vila Operária',
      network: 'Estadual',
      gre: '4ª GRE',
      stages: ['Ensino Médio', 'Técnico Integrado'],
      students: 939,
      teachers: 81,
      idebEf: null,
      idebEm: 4.6,
      courses: 'Farmácia, Nutrição e Dietética',
      award: 'IDEB EM 4,6 acima da média estadual (4,3 rede estadual)',
      period: 'Censo 2025 / IDEB 2023'
    },
    {
      inep: '22025316',
      name: 'CETI em Saúde Mons. José Luís Barbosa Cortez',
      zone: 'Centro',
      municipality: 'Teresina',
      neighborhood: 'Monte Castelo',
      network: 'Estadual',
      gre: 'Sup. Centro',
      stages: ['Ensino Médio', 'Técnico Integrado', 'EJA'],
      students: 728,
      teachers: 91,
      idebEf: null,
      idebEm: null,
      courses: 'Formação Técnica em Saúde (+264 matrículas EJA)',
      award: 'Polo de referência técnica em Saúde na rede estadual',
      period: 'Censo Escolar 2025'
    },
    {
      inep: '22027742',
      name: 'CETI Paulo Ferraz',
      zone: 'Centro',
      municipality: 'Teresina',
      neighborhood: 'Vermelha',
      network: 'Estadual',
      gre: '19ª GRE Centro-Sul',
      stages: ['Ensino Médio', 'Técnico Integrado'],
      students: 277,
      teachers: 32,
      idebEf: null,
      idebEm: null,
      courses: 'Técnico Integrado em Tempo Integral',
      award: 'Atendimento integral no eixo Centro-Sul',
      period: 'Censo Escolar 2025'
    },
    {
      inep: '22027459',
      name: 'CETI Desembargador Heli Sobral',
      zone: 'Norte',
      municipality: 'Teresina',
      neighborhood: 'Mocambinho',
      network: 'Estadual',
      gre: '4ª GRE Centro-Norte',
      stages: ['Ens. Fundamental', 'Ensino Médio', 'EJA', 'Técnico Integrado'],
      students: 396,
      teachers: 56,
      idebEf: 5.1,
      idebEm: 4.3,
      courses: 'Desenvolvimento de Sistemas',
      award: '100% de taxa de aprovação no Ensino Médio (2023)',
      period: 'Censo 2025 / IDEB 2023'
    },
    {
      inep: '22310754',
      name: 'CETI José Pereira da Silva',
      zone: 'Norte',
      municipality: 'Teresina',
      neighborhood: 'Parque Brasil II',
      network: 'Estadual',
      gre: '4ª GRE Centro-Norte',
      stages: ['Ensino Médio', 'Técnico Integrado'],
      students: 330,
      teachers: 21,
      idebEf: null,
      idebEm: 4.4,
      courses: 'Ensino Médio Profissionalizante (12 salas climatizadas)',
      award: '100% aprovação no EM (SAEB/IDEB 2023)',
      period: 'Censo 2025 / IDEB 2023'
    },
    {
      inep: '22136665',
      name: 'E.M. Prof. José Camilo da Silveira Filho',
      zone: 'Norte',
      municipality: 'Teresina',
      neighborhood: 'Santa Rosa',
      network: 'Municipal',
      gre: 'SEMEC Norte',
      stages: ['Ens. Fundamental (Anos Iniciais)'],
      students: 484,
      teachers: 22,
      idebEf: 7.9,
      idebEm: null,
      courses: 'Ciclo de Alfabetização e Anos Iniciais',
      award: 'IDEB 7,9 — um dos maiores índices públicos de Teresina',
      period: 'Censo 2024 / IDEB 2023'
    },
    {
      inep: '22028072',
      name: 'E.M. Deputado Antônio Gayoso',
      zone: 'Norte',
      municipality: 'Teresina',
      neighborhood: 'São Joaquim',
      network: 'Municipal',
      gre: 'SEMEC Norte',
      stages: ['Ens. Fundamental (Anos Finais)'],
      students: 900,
      teachers: 43,
      idebEf: 6.0,
      idebEm: null,
      courses: 'Anos Finais do Fundamental',
      award: 'IDEB 6,0 (98,3% aprovação; acima das médias municipal e nacional)',
      period: 'Censo 2025 / IDEB 2023'
    },
    {
      inep: '22108297',
      name: 'E.M. Profª. Darcy Pereira de Carvalho',
      zone: 'Norte',
      municipality: 'Teresina',
      neighborhood: 'Santa Maria (Pq. Wall Ferraz)',
      network: 'Municipal',
      gre: 'SEMEC Norte',
      stages: ['Ens. Fundamental (Anos Iniciais)'],
      students: 714,
      teachers: 26,
      idebEf: 5.8,
      idebEm: null,
      courses: 'Ensino Fundamental Anos Iniciais',
      award: 'Atendimento expressivo na região da Santa Maria da Codipi',
      period: 'Censo 2025 / IDEB 2023'
    },
    {
      inep: '22025308',
      name: 'CETI Gov. Dirceu Mendes Arcoverde',
      zone: 'Leste',
      municipality: 'Teresina',
      neighborhood: 'Morada do Sol',
      network: 'Estadual',
      gre: '20ª GRE / Sup. Nordeste',
      stages: ['Ensino Médio', 'Técnico Integrado'],
      students: 659,
      teachers: 54,
      idebEf: null,
      idebEm: null,
      courses: 'Informática & Turmas Especiais ITA/IME',
      award: 'Premiada no Torneio de Matemática TME² 2025 (Turmas ITA/IME)',
      period: 'Censo Escolar 2025'
    },
    {
      inep: '22124616',
      name: 'E.M. Casa Meio Norte',
      zone: 'Leste',
      municipality: 'Teresina',
      neighborhood: 'Cidade Jardim / Verde Lar',
      network: 'Municipal',
      gre: 'SEMEC Leste',
      stages: ['Ens. Fundamental (Anos Iniciais)'],
      students: 326,
      teachers: 12,
      idebEf: 7.2,
      idebEm: null,
      courses: 'Ensino Fundamental Anos Iniciais',
      award: 'IDEB 7,2 em 2023 com 0% de abandono/reprovação',
      period: 'Censo 2024 / IDEB 2023'
    },
    {
      inep: '22025146',
      name: 'E.M. Teodoro Machado Coelho',
      zone: 'Leste',
      municipality: 'Teresina',
      neighborhood: 'Povoado Tabocas (Zona Rural Leste)',
      network: 'Municipal',
      gre: 'SEMEC Rural Leste',
      stages: ['Ens. Fundamental (Anos Iniciais)'],
      students: null,
      teachers: null,
      idebEf: 7.8,
      idebEm: null,
      courses: 'Ensino Fundamental Rural',
      award: 'IDEB 7,8 — excelência educacional na zona rural de Teresina',
      period: 'Censo 2024 / IDEB 2023'
    },
    {
      inep: '22143416',
      name: 'CETI Prof. Paulo Machado de Resende',
      zone: 'Leste',
      municipality: 'Teresina',
      neighborhood: 'Vale do Gavião',
      network: 'Estadual',
      gre: '20ª GRE',
      stages: ['Ensino Médio', 'Tempo Integral'],
      students: 158,
      teachers: 18,
      idebEf: null,
      idebEm: null,
      courses: 'Ensino Médio Integral',
      award: 'Expansão do ensino integral na zona Leste',
      period: 'Censo Escolar 2025'
    },
    {
      inep: '22256725',
      name: 'CETI João Henrique de Almeida Sousa',
      zone: 'Sul',
      municipality: 'Teresina',
      neighborhood: 'Morada Nova',
      network: 'Estadual',
      gre: '19ª GRE / Sup. Sul',
      stages: ['Ensino Médio', 'Tempo Integral'],
      students: 343,
      teachers: 19,
      idebEf: null,
      idebEm: 6.3,
      courses: 'Ensino Médio Integral & Olimpíadas Científicas',
      award: 'IDEB EM 6,3 + Medalhista Ouro TME² 2025 & Intercâmbio Seduckathon Alemanha',
      period: 'Censo 2024 / IDEB 2023'
    },
    {
      inep: '22027203',
      name: 'CETI Prof. Antônio Maria Madeira',
      zone: 'Sul',
      municipality: 'Teresina',
      neighborhood: 'Parque Piauí',
      network: 'Estadual',
      gre: 'Sup. Sul',
      stages: ['Ens. Fundamental', 'Ensino Médio', 'Técnico Integrado'],
      students: 258,
      teachers: 30,
      idebEf: 5.7,
      idebEm: 4.8,
      courses: 'Administração, Desenvolvimento de Sistemas',
      award: 'IDEB EF 5,7 e EM 4,8 acima da média nacional (+28,4% matr. 2017–25)',
      period: 'Censo 2025 / IDEB 2023'
    },
    {
      inep: '22027599',
      name: 'CETI Nair Gonçalves',
      zone: 'Sul',
      municipality: 'Teresina',
      neighborhood: 'São Pedro',
      network: 'Estadual',
      gre: 'Sup. Sul',
      stages: ['Ens. Fundamental', 'Ensino Médio', 'Técnico Integrado'],
      students: 183,
      teachers: 20,
      idebEf: 5.3,
      idebEm: 4.5,
      courses: 'Ensino Médio Profissionalizante (8 salas climatizadas)',
      award: 'IDEB EM 4,5 superando meta projetada (3,5)',
      period: 'Censo 2025 / IDEB 2023'
    },
    {
      inep: '22024859',
      name: 'E.M. Prof. Antilhon Ribeiro Soares',
      zone: 'Sul',
      municipality: 'Teresina',
      neighborhood: 'Lourival Parente',
      network: 'Municipal',
      gre: 'SEMEC Sul',
      stages: ['Ens. Fundamental (Anos Finais)'],
      students: 394,
      teachers: 26,
      idebEf: 5.9,
      idebEm: null,
      courses: 'Anos Finais do Fundamental',
      award: 'IDEB 5,9 (99,1% aprovação) acima da média estadual (4,7)',
      period: 'Censo 2025 / IDEB 2023'
    },
    {
      inep: '22028951',
      name: 'CETI Prof. Agripino Oliveira',
      zone: 'Sul',
      municipality: 'Teresina',
      neighborhood: 'Parque Piauí',
      network: 'Estadual',
      gre: 'Sup. Sul',
      stages: ['Ens. Fundamental', 'Ensino Médio', 'Técnico Integrado'],
      students: 180,
      teachers: 23,
      idebEf: null,
      idebEm: null,
      courses: 'Educação Profissional & Integral',
      award: 'Atendimento integrado na região Sul',
      period: 'Censo Escolar 2025'
    },
    {
      inep: '22143017',
      name: 'CETI Prof. José Pacífico de Moura Neto',
      zone: 'Sudeste',
      municipality: 'Teresina',
      neighborhood: 'Novo Horizonte',
      network: 'Estadual',
      gre: '21ª GRE / Sudeste',
      stages: ['Ensino Médio', 'Técnico Integrado', 'EJA'],
      students: 799,
      teachers: 68,
      idebEf: null,
      idebEm: null,
      courses: 'Enfermagem, Informática, Edificações, Segurança do Trabalho (+245 EJA)',
      award: 'Maior CETI estadual em matrículas integradas no Grande Dirceu',
      period: 'Censo Escolar 2025'
    },
    {
      inep: '22027556',
      name: 'CETI Maria Modestina Bezerra',
      zone: 'Sudeste',
      municipality: 'Teresina',
      neighborhood: 'Novo Horizonte',
      network: 'Estadual',
      gre: 'Sup. Sudeste',
      stages: ['Ens. Fundamental (Anos Finais)', 'Ensino Médio'],
      students: null,
      teachers: null,
      idebEf: 5.8,
      idebEm: 4.9,
      courses: 'Ensino Integral Fundamental & Médio',
      award: 'IDEB 5,8 (EF Finais) e 4,9 (EM) entre os maiores da Zona Sudeste',
      period: 'IDEB 2023 (INEP)'
    },
    {
      inep: '22027360',
      name: 'CETI Santa Inês',
      zone: 'Sudeste',
      municipality: 'Teresina',
      neighborhood: 'Dirceu Arcoverde I',
      network: 'Estadual',
      gre: 'Sup. Sudeste',
      stages: ['Ens. Fundamental', 'Ensino Médio', 'Técnico Integrado'],
      students: 447,
      teachers: 38,
      idebEf: 5.4,
      idebEm: 4.4,
      courses: 'Profissionalizante Integrado',
      award: '99–100% de aprovação com acessibilidade e educação especial',
      period: 'Censo 2025 / IDEB 2023'
    },
    {
      inep: '22027475',
      name: 'CETI Didácio Silva',
      zone: 'Sudeste',
      municipality: 'Teresina',
      neighborhood: 'Dirceu Arcoverde II',
      network: 'Estadual',
      gre: 'Sup. Sudeste',
      stages: ['Ensino Médio', 'Tempo Integral'],
      students: 436,
      teachers: 28,
      idebEf: null,
      idebEm: null,
      courses: 'Ensino Médio Integral',
      award: '86% de participação no ENEM e 0% abandono (Censo 2025)',
      period: 'Censo Escolar 2025'
    },
    {
      inep: '22027661',
      name: 'CETI Prof. Pinheiro Machado',
      zone: 'Sudeste',
      municipality: 'Teresina',
      neighborhood: 'Dirceu Arcoverde I',
      network: 'Estadual',
      gre: '21ª GRE / Sudeste',
      stages: ['Ensino Médio', 'Tempo Integral'],
      students: 258,
      teachers: 27,
      idebEf: null,
      idebEm: null,
      courses: 'Ensino Médio Integral',
      award: '0% reprovação e 0% abandono no Censo Escolar 2025',
      period: 'Censo Escolar 2025'
    },
    {
      inep: '22136002',
      name: 'CETI Augustinho Brandão',
      zone: 'Interior',
      municipality: 'Cocal dos Alves',
      neighborhood: 'Centro (Norte do PI)',
      network: 'Estadual',
      gre: '3ª GRE',
      stages: ['Ens. Fundamental', 'Ensino Médio', 'Técnico Integrado', 'EJA'],
      students: 247,
      teachers: 23,
      idebEf: null,
      idebEm: null,
      courses: 'Preparação Olímpica Integrada (+101 EJA)',
      award: 'Ícone nacional OBMEP (dezenas de medalhas), Prêmio Darcy Ribeiro e Bicampeão TME² 2025',
      period: 'Censo 2025 / SEDUC-PI'
    },
    {
      inep: '22135456',
      name: 'CETI Liceu Parnaibano',
      zone: 'Interior',
      municipality: 'Parnaíba',
      neighborhood: 'Nossa Senhora de Fátima',
      network: 'Estadual',
      gre: '1ª GRE (Litoral)',
      stages: ['Ensino Médio', 'Técnico Integrado', 'EJA'],
      students: 732,
      teachers: 66,
      idebEf: null,
      idebEm: null,
      courses: 'Administração, Comércio, Contabilidade, Marketing (+70 EJA)',
      award: 'Premiada no Torneio de Matemática TME² 2025 e polo técnico do Litoral',
      period: 'Censo Escolar 2025'
    },
    {
      inep: '22082549',
      name: 'CETI Marcos Parente',
      zone: 'Interior',
      municipality: 'Picos',
      neighborhood: 'Bomba (Centro-Sul)',
      network: 'Estadual',
      gre: '9ª GRE',
      stages: ['Ens. Fundamental', 'Ensino Médio', 'Técnico Integrado'],
      students: null,
      teachers: null,
      idebEf: null,
      idebEm: null,
      courses: 'Ensino Integral e Educação Profissional',
      award: 'Referência estadual de Ensino Médio no polo de Picos',
      period: 'Censo Escolar / SEDUC-PI'
    }
  ],
  educationAwards: [
    {
      id: 'premio-mec-ept',
      badge: '1º DO BRASIL · MEC',
      title: 'Prêmio MEC da Educação Brasileira (Ensino Profissional e Tempo Integral)',
      scope: 'Rede Estadual do Piauí (SEDUC-PI)',
      detail: 'Primeiro e único estado do Brasil com 100% das escolas estaduais de Ensino Médio em tempo integral (84.474 matrículas integrais em 2025) e 1º lugar nacional em matrículas EPT integradas (~60% · 61.420 jovens).'
    },
    {
      id: 'selo-ouro-ica',
      badge: '1º CAPITAIS · SELO OURO',
      title: 'Selo Ouro Criança Alfabetizada & 1º Lugar ICA 2025 entre Capitais',
      scope: 'Rede Municipal de Teresina (SEMEC)',
      detail: 'Teresina atingiu 80,58% no Indicador Criança Alfabetizada (2025) — salto frente a 57,25% no ciclo anterior — recebendo o Selo Ouro do Ministério da Educação entre apenas 10 capitais brasileiras.'
    },
    {
      id: 'obmep-darcy',
      badge: 'OLIMPÍADA NACIONAL · OBMEP',
      title: 'Cocal dos Alves & Escolas Piauienses na OBMEP + Prêmio Darcy Ribeiro',
      scope: 'CETI Augustinho Brandão & Rede Pública',
      detail: 'O CETI Augustinho Brandão tornou-se referência nacional com dezenas de medalhas de ouro, prata e bronze na OBMEP, além de conquistar o Prêmio Darcy Ribeiro de Educação na Câmara dos Deputados.'
    },
    {
      id: 'tme2-2025',
      badge: 'MATEMÁTICA · 200 FINALISTAS',
      title: 'Torneio de Matemática das Escolas Estaduais (TME² 2025)',
      scope: 'SEDUC-PI (1ª, 3ª e 20ª GREs)',
      detail: '200 estudantes premiados com bolsas de estudo; escolas destaque incluíram CETI Augustinho Brandão (bicampeão), CETI Gov. Dirceu Mendes Arcoverde (Turmas ITA/IME), CETI Liceu Parnaibano e CETI João Henrique de Almeida Sousa.'
    },
    {
      id: 'seduckathon-intercambio',
      badge: 'INOVAÇÃO & INTERCÂMBIO',
      title: 'Seduckathon — Intercâmbio Internacional em Tecnologia e Programação',
      scope: 'Estudantes de Teresina e Interior (SEDUC-PI)',
      detail: 'Equipes vencedoras de escolas estaduais (Teresina, Campo Maior, Batalha, Monsenhor Gil, Pio IX e outras) premiadas com intercâmbios educacionais nos Estados Unidos, Coreia do Sul e Alemanha.'
    },
    {
      id: 'ideb-nordeste-2023',
      badge: '4º BRASIL · 1º NORDESTE',
      title: 'IDEB 2023: Ensino Médio em 4º no Brasil e 1º do Nordeste (4,5)',
      scope: 'Rede Estadual & Municipal (INEP)',
      detail: 'Avanço de 9º (2021) para 4º lugar nacional no Ensino Médio (nota 4,5), além de Teresina atingir IDEB 6,4 (Anos Iniciais) e 5,8 (Anos Finais) na rede municipal.'
    }
  ],
  educationNewsArchive: [
    {
      date: '2026-01-21',
      title: 'Piauí é o primeiro e único estado do Brasil com 100% das escolas públicas de Ensino Médio em tempo integral',
      url: 'https://www.pi.gov.br/piaui-e-o-primeiro-e-unico-estado-do-brasil-a-ter-100-das-escolas-publicas-de-ensino-medio-em-tempo-integral/',
      source: 'Governo do Piauí / SEDUC-PI'
    },
    {
      date: '2025-05-20',
      title: 'Seduckathon 2025 anuncia equipes finalistas que avançam para maratona com intercâmbio internacional',
      url: 'https://www.pi.gov.br/com-recorde-de-inscritos-seduckathon-2025-anuncia-equipes-que-avancam-para-a-maratona-final-em-junho/',
      source: 'Governo do Piauí / SEDUC-PI'
    },
    {
      date: '2026-03-10',
      title: 'Painel QEdu / INEP Teresina: indicadores oficiais da rede municipal (SEMEC) e estadual na capital',
      url: 'https://qedu.org.br/cidade/2211001-teresina',
      source: 'QEdu / INEP Teresina'
    }
  ],
  territories12: [
    { id: 'TD1', name: 'Planície Litorânea', pole: 'Parnaíba / Luís Correia', macro: 'Litoral / Norte', focus: 'ZPE Parnaíba, Porto Luís Correia, H₂ verde, turismo Delta e carcinicultura' },
    { id: 'TD2', name: 'Cocais', pole: 'Piripiri / Esperantina / Batalha', macro: 'Meio-Norte', focus: 'Parque Empresarial Piripiri, comércio, agricultura familiar e extrativismo' },
    { id: 'TD3', name: 'Carnaubais', pole: 'Campo Maior / Castelo do Piauí', macro: 'Centro-Norte', focus: 'Cera de carnaúba, pecuária, turismo geológico (Castelo) e serviços' },
    { id: 'TD4', name: 'Entre Rios', pole: 'Teresina / Altos / União / José de Freitas', macro: 'Metropolitana', focus: 'Capital política e econômica (serviços 71,7% PIB, saúde, educação, TI)' },
    { id: 'TD5', name: 'Vale do Sambito', pole: 'Valença do Piauí / Elesbão Veloso', macro: 'Centro-Norte', focus: 'Agricultura familiar, comércio regional e eixo rodoviário BR-316' },
    { id: 'TD6', name: 'Vale do Rio Guaribas', pole: 'Picos / Sussuapara', macro: 'Centro-Sul', focus: 'Segundo maior entroncamento comercial, Parque Empresarial Picos e apicultura' },
    { id: 'TD7', name: 'Chapada Vale do Rio Itaim', pole: 'Jaicós / Simões / Marcolândia', macro: 'Semiárido Leste', focus: 'Grandes complexos de geração eólica (Simões 375 MW, Marcolândia 206 MW)' },
    { id: 'TD8', name: 'Vale do Canindé', pole: 'Oeiras / Simplício Mendes', macro: 'Centro-Sul', focus: 'Primeira capital histórica, patrimônio cultural e geração solar (João Costa)' },
    { id: 'TD9', name: 'Serra da Capivara', pole: 'São Raimundo Nonato / Dom Inocêncio', macro: 'Semiárido Sul', focus: 'Patrimônio UNESCO, aeroporto regional e parque eólico Dom Inocêncio (877 MW)' },
    { id: 'TD10', name: 'Vale dos Rios Piauí e Itaueiras', pole: 'Floriano / Guadalupe / Ribeira do PI', macro: 'Sul-Centro', focus: 'Polo médico/educacional (IDHM 0,700), Usina Boa Esperança e solar Ribeira (210 MW)' },
    { id: 'TD11', name: 'Tabuleiros do Alto Parnaíba', pole: 'Uruçuí / Baixa Grande do Ribeiro', macro: 'Cerrados / MATOPIBA', focus: 'Liderança estadual em soja/milho, esmagamento e logística de grãos' },
    { id: 'TD12', name: 'Chapada das Mangabeiras', pole: 'Bom Jesus / Corrente / São Gonçalo', macro: 'Extremo Sul / Cerrados', focus: 'Fronteira agrícola MATOPIBA (+27% pop. Bom Jesus) e complexo solar São Gonçalo (790 MW)' }
  ],
  energyRenewables: {
    nationalRank: '3º lugar nacional em produção de energias renováveis (ANEEL)',
    matrizEletricaLimpaPct: 95,
    windOperationalGw: 3.5,
    windBuildingMw: 746.1,
    windForecastGw: 2.5,
    solarOperationalGw: 1.46,
    solarBuildingMw: 867.22,
    solarForecastGw: 13.14,
    solarTeresinaRank: '4ª cidade do Brasil em energia solar distribuída residencial',
    highlights: [
      { place: 'Dom Inocêncio', type: 'Eólica', capacity: '877,85 MW em operação' },
      { place: 'Lagoa do Barro do Piauí', type: 'Eólica', capacity: '671,70 MW em operação' },
      { place: 'Caldeirão Grande do Piauí', type: 'Eólica + Solar', capacity: '473,4 MW eólica + 213,1 MW solar' },
      { place: 'São Gonçalo do Gurguéia', type: 'Solar', capacity: '790,37 MW (maior complexo solar da América do Sul)' },
      { place: 'Simões & Curral Novo', type: 'Eólica', capacity: '375,1 MW + 338,1 MW em operação' },
      { place: 'Parnaguá & Brasileira', type: 'Solar (em construção)', capacity: '657,2 MW + 210,0 MW em obras' }
    ]
  },
  demographicsBreakdown: {
    censusSeriesPI: [
      { year: 1991, pop: 2582137 },
      { year: 2000, pop: 2843278 },
      { year: 2010, pop: 3119097 },
      { year: 2022, pop: 3271199 },
      { year: 2025, pop: 3384547 }
    ],
    ageGroupsPI2022: [
      { group: '0 a 14 anos', count: 681934, pct: 20.85 },
      { group: '15 a 64 anos', count: 2240511, pct: 68.49 },
      { group: '65 anos ou mais', count: 348754, pct: 10.66 }
    ],
    genderPI2022: { female: 1670597, femalePct: 51.1, male: 1600602, malePct: 48.9, sexRatio: 95.8 },
    urbanRuralPI2022: { urban: 2271384, urbanPct: 69.44, rural: 999815, ruralPct: 30.56 },
    agingPI2022: { medianAge: 34, agingIndex: 51.1, share65Plus1980: 3.7, share65Plus2010: 7.5, share65Plus2022: 10.7, nationalRank65Plus: '8º mais envelhecido do Brasil' },
    topCities2022: [
      { name: 'Teresina', pop2022: 866300, growthPct: 6 },
      { name: 'Parnaíba', pop2022: 162159, growthPct: 11 },
      { name: 'Picos', pop2022: 83090, growthPct: 12 },
      { name: 'Piripiri', pop2022: 65450, growthPct: 6 },
      { name: 'Floriano', pop2022: 62036, growthPct: 8 },
      { name: 'Barras', pop2022: 47938, growthPct: 7 },
      { name: 'Altos', pop2022: 47416, growthPct: 22 },
      { name: 'União', pop2022: 46119, growthPct: 8 },
      { name: 'Campo Maior', pop2022: 45793, growthPct: 1 },
      { name: 'José de Freitas', pop2022: 42559, growthPct: 15 },
      { name: 'São Raimundo Nonato', pop2022: 38934, growthPct: 20 },
      { name: 'Bom Jesus', pop2022: 28799, growthPct: 27 }
    ]
  },
  caged2025: {
    piauiNetJobs: 21022,
    admissions: 167430,
    dismissals: 146408,
    growthPct: 5.81,
    nationalRankGrowth: '3º maior crescimento percentual do Brasil em 2025 (atrás de AP e PB)',
    stockPI: 368971,
    stockTeresina: 234700,
    bySector: [
      { sector: 'Serviços', net: 9537 },
      { sector: 'Comércio', net: 4393 },
      { sector: 'Construção', net: 3840 },
      { sector: 'Indústria', net: 2502 },
      { sector: 'Agropecuária', net: 755 }
    ],
    topCitiesNet: [
      { city: 'Teresina', net: 9646 },
      { city: 'Picos', net: 1619 },
      { city: 'Parnaíba', net: 1103 },
      { city: 'Piripiri', net: 1067 },
      { city: 'São Raimundo Nonato', net: 691 }
    ]
  },
  idhMunicipalTop: [
    { rank: 1, name: 'Teresina', idhm: 0.751, income: 0.731, longevity: 0.820, education: 0.707, tier: 'Alto' },
    { rank: 2, name: 'Floriano', idhm: 0.700, income: 0.676, longevity: 0.802, education: 0.633, tier: 'Alto' },
    { rank: 3, name: 'Picos', idhm: 0.698, income: 0.684, longevity: 0.800, education: 0.621, tier: 'Médio' },
    { rank: 4, name: 'Parnaíba', idhm: 0.687, income: 0.658, longevity: 0.816, education: 0.604, tier: 'Médio' },
    { rank: 5, name: 'Bom Jesus', idhm: 0.668, income: null, longevity: null, education: null, tier: 'Médio' },
    { rank: 6, name: 'São Raimundo Nonato', idhm: 0.661, income: null, longevity: null, education: null, tier: 'Médio' }
  ],
  publicSecurity: {
    sourceSummary: 'SSP-PI / DataSSP · Programa Pacto pela Ordem · CellGuard (Etipi)',
    periodNote: 'Comparativo oficial jan–mai/2026 vs 2022 e 2025 em Teresina + mar/abr 2026 no Piauí.',
    highlightsPI: [
      { label: 'Homicídios no PI (mar/2026)', value: '34 registros', delta: 'Menor patamar mensal em 14 anos (série desde 2012)' },
      { label: 'Feminicídios (jan–abr/2026)', value: '5 casos vs 21 ant.', delta: '-75% no 1º trimestre (15 dias seguidos sem registro em abr/26)' },
      { label: 'CellGuard / Etipi', value: '+11.000 recuperados', delta: 'Rastreamento automático IMEI + WhatsApp devolvendo aparelhos às vítimas' },
      { label: 'Roubo de celulares (mar/2026 PI)', value: '-80% vs 2022', delta: 'Rompimento da cadeia de receptação com integração operacional' }
    ],
    teresinaSeries: [
      { metric: 'CVLI (Crimes Violentos Letais Intencionais)', y2022: 115, y2025: 89, y2026: 55, dropVs2022Pct: -52.17, dropVs2025Pct: -38.20 },
      { metric: 'Homicídios Dolosos', y2022: 108, y2025: 84, y2026: 54, dropVs2022Pct: -50.00, dropVs2025Pct: -35.71 },
      { metric: 'Roubo Geral', y2022: 6688, y2025: 3798, y2026: 2240, dropVs2022Pct: -66.51, dropVs2025Pct: -41.02 },
      { metric: 'Roubo de Celulares', y2022: 4643, y2025: 2526, y2026: 1200, dropVs2022Pct: -74.15, dropVs2025Pct: -52.49 },
      { metric: 'Roubo com Arma de Fogo', y2022: 4604, y2025: 2481, y2026: 1158, dropVs2022Pct: -74.85, dropVs2025Pct: -53.33 },
      { metric: 'Receptação de Celulares', y2022: null, y2025: 415, y2026: 55, dropVs2022Pct: null, dropVs2025Pct: -86.75 }
    ],
    pillars: [
      {
        id: 'pacto-ordem',
        tag: 'GOVERNANÇA',
        title: 'Pacto pela Ordem & Integração Justiça/MP',
        detail: 'Aumento de efetivo, operações integradas entre PM-PI, Polícia Civil, Poder Judiciário e Ministério Público para acelerar prisões e conter a reincidência criminal.'
      },
      {
        id: 'cellguard',
        tag: 'GOVTECH SSP + ETIPI',
        title: 'CellGuard — Recuperação Inteligente de Celulares',
        detail: 'Plataforma da SSP-PI com a Etipi que cruza IMEI com operadoras e dispara intimações automáticas via WhatsApp, já recuperando mais de 11 mil celulares e derrubando a receptação em -86,75%.'
      },
      {
        id: 'letalidade-controle',
        tag: 'DIREITOS & EFICIÊNCIA',
        title: 'Redução Criminal com Baixa Letalidade Policial',
        detail: 'Piauí combina recuo contínuo de CVLI e roubos mantendo uma das menores taxas de letalidade decorrente de intervenção policial no Brasil.'
      },
      {
        id: 'spia-inteligencia',
        tag: 'MONITORAMENTO URBANO',
        title: 'DataSSP, Cercamento Eletrônico & Videomonitoramento',
        detail: 'Análise estatística contínua (DataSSP) direcionando policiamento por mancha criminal nas zonas de Teresina e divisas estaduais.'
      }
    ]
  },
  edtechEcosystem: {
    headlineMetrics: [
      { label: 'Estudantes em IA Curricular', value: '120.000+', sub: '1º território das Américas (Prêmio UNESCO)' },
      { label: 'Professores Capacitados em IA', value: '800+', sub: 'Formação 60h (Unipampa / IFFar / UFRGS)' },
      { label: 'Aprovados PIT em IA (2026)', value: '78 egressos', sub: 'Bacharelado & Tecnólogo em IA vindos da rede estadual' },
      { label: 'Inscritos Seduckathon 2025', value: '9.000+', sub: '130 alunos + 26 prof. em intercâmbio em 6 países' }
    ],
    initiatives: [
      {
        id: 'piaui-ia-unesco',
        badge: 'PRÊMIO UNESCO · AMÉRICAS',
        title: 'Programa Piauí Inteligência Artificial nas Escolas',
        scope: '9º ano EF ao 3º ano EM (Rede Estadual)',
        impactScore: 98,
        detail: 'Primeiro território das Américas a tornar a disciplina de IA obrigatória na educação básica, premiado pela UNESCO. Mais de 120 mil alunos atendidos e 800 docentes capacitados via SEDUC-PI com Unipampa, IFFar e UFRGS.'
      },
      {
        id: 'pit-ia-superior',
        badge: 'ENSINO SUPERIOR TECH',
        title: 'Piauí Instituto de Tecnologia (PIT) — Graduações em IA',
        scope: 'Teresina / Ecossistema Estadual',
        impactScore: 88,
        detail: 'Conectando o ensino médio técnico e a disciplina de IA ao ensino superior tecnológico: 78 estudantes egressos da SEDUC aprovados em 2026 para Bacharelado e Tecnólogo em Inteligência Artificial.'
      },
      {
        id: 'canal-educacao',
        badge: '224 MUNICÍPIOS · IA PEDAGÓGICA',
        title: 'Canal Educação & Correção de Redação por IA',
        scope: 'Todo o Estado (Rural e Urbano)',
        impactScore: 94,
        detail: 'Mediação tecnológica em todos os 224 municípios piauienses combinada com planos individuais de estudo, correção automatizada de redações para o ENEM, plataforma de leitura e ensino de inglês.'
      },
      {
        id: 'seduckathon-intercambio',
        badge: 'MAIOR HACKATHON ESCOLAR',
        title: 'Seduckathon & Jogos Inclusivos (ex.: DeltaEdu)',
        scope: 'EUA, Coreia do Sul, Alemanha, China, Portugal, Singapura',
        impactScore: 95,
        detail: 'Mais de 9 mil jovens inscritos e 175 finalistas desenvolvendo softwares e robótica para desafios reais das escolas (como o DeltaEdu, criado no CETI Liceu Parnaibano para alunos com dislexia e discalculia).'
      },
      {
        id: 'soberania-zpe',
        badge: 'INFRAESTRUTURA SOBERANA',
        title: 'SoberanIA & Condomínio de Data Centers Verdes (ZPE)',
        scope: 'Teresina & Parnaíba (Investe Piauí / MCTI)',
        impactScore: 90,
        detail: 'Parcerias para nuvem soberana de IA (SoberanIA), 11 startups de tecnologia já operando na ZPE Parnaíba, 34 startups na missão Web Summit Lisboa e projeto de Data Center Verde ancorado em energia limpa >95%.'
      },
      {
        id: 'escola-tecnologia-the',
        badge: 'CAPACITAÇÃO CAPITAL',
        title: 'Nova Escola de Tecnologia em Teresina & Robótica',
        scope: 'Teresina · ~3.000 jovens beneficiados',
        impactScore: 86,
        detail: 'Laboratórios de programação, jogos digitais, robótica e realidade aumentada implantados nos CETIs de tempo integral mais polo de formação digital em Teresina.'
      }
    ]
  },
  swotCrossMatrix: [
    { strategy: 'SO · Estratégia Ofensiva (Forças × Oportunidades)', action: 'Usar a energia limpa (>95%, 3º do país) + 100% Tempo Integral/IA escolar para ancorar H₂ Verde, Data Centers na ZPE e polos de TI na capital.' },
    { strategy: 'WO · Estratégia de Reforço (Fraquezas × Oportunidades)', action: 'Concluir a Transnordestina e ampliar esgotamento sanitário (39% em Teresina) com PPPs para evitar estrangulamento logístico do MATOPIBA e da capital.' },
    { strategy: 'ST · Estratégia Defensiva (Forças × Ameaças)', action: 'Sustentar a folga fiscal na LRF (56,1% RCL) e segurança pública baseada em inteligência (CellGuard / DataSSP) para blindar investimentos diante de juros altos.' },
    { strategy: 'WT · Contingência Estrutural (Fraquezas × Ameaças)', action: 'Mitigar seca no semiárido e dependência de transferências com irrigação, reservação hídrica e geração de empregos formais (+21 mil CAGED/ano).' }
  ],
  teresinaCapital: {
    overview: {
      name: 'Teresina',
      ibgeCode: '2211001',
      founded: '16/08/1852',
      pop2022: 866300,
      pop2025: 905692,
      popShareStatePct: 26.76,
      density2022: 622.66,
      totalAreaKm2: 1391.29,
      urbanAreaKm2: 172.26,
      pib2023Bi: 28.2,
      pibPerCapita2023: 33994.07,
      idhm2010: 0.751,
      idhmComponents: { income: 0.731, longevity: 0.820, education: 0.707 },
      formalWorkersIBGE2023: 367319,
      cagedStock2025: 234700,
      cagedNet2025: 9646,
      susUnits: 181,
      infantMortality2023: 14.71,
      sewerNetworkPct2022: 39.0,
      streetTreesPct2022: 58.16
    },
    budget: {
      receitaBruta2024Siconfi: 5396868035.81,
      despesaEmpenhada2024Siconfi: 5396776250.15,
      transferenciasCorrentesPct2024: 65.99,
      loa2025Total: 5668376000,
      receitasCorrentes2025: 5575865000,
      impostosProprios2025: 1020049000,
      transferencias2025: 3535519000,
      minEducacaoPct: 25,
      minSaudePct: 15,
      seriesReceitasCorrentes: [
        { year: 2021, valueBi: 3.508 },
        { year: 2022, valueBi: 4.066 },
        { year: 2023, valueBi: 4.440 },
        { year: 2024, valueBi: 4.878 },
        { year: 2025, valueBi: 5.245 }
      ]
    },
    zonesUrban2022: [
      { zone: 'Sul', pop2022: 195228, growth2010_22: 16.01, neighborhoods: 32, favelasPop: 47523, highlight: 'Maior subdistrito urbano e maior crescimento da capital (Promorar, Parque Piauí, Morada Nova, Vila Irmã Dulce).' },
      { zone: 'Leste', pop2022: 192168, growth2010_22: 14.75, neighborhoods: 27, favelasPop: 56583, highlight: 'Alta renda no eixo Jóquei/Ininga/Fátima ao lado de 44 comunidades urbanas e polo universitário UFPI/UESPI.' },
      { zone: 'Norte', pop2022: 189523, growth2010_22: 6.02, neighborhoods: 23, favelasPop: 55830, highlight: 'Concentração populacional na Santa Maria da Codipi, Mocambinho, Parque Brasil e berço histórico do Poti Velho.' },
      { zone: 'Sudeste', pop2022: 134752, growth2010_22: 0.47, neighborhoods: 20, favelasPop: 24685, highlight: 'Grande Dirceu e Itararé (bairro mais populoso com 37,4 mil hab.); forte comércio e expansão do Metrô/VLT.' },
      { zone: 'Centro', pop2022: 95857, growth2010_22: -19.40, neighborhoods: 18, favelasPop: 11812, highlight: 'Centro histórico, polo médico (HUT/hospitais), comércio tradicional e serviços, com perda residencial de 23 mil hab. na década.' }
    ],
    mobilityAndInfra: [
      { title: 'Metrô / VLT de Teresina', metric: 'R$ 600 milhões', detail: 'Modernização e nova estação na Zona Sudeste com licitação de novos Veículos Leves sobre Trilhos (VLTs) para horários de pico.' },
      { title: 'Sistema Inthegra', metric: '8 terminais previstos', detail: 'Integração tronco-alimentadora conectando Zona Sudeste, Sul, Norte e Leste por corredores exclusivos e linhas diametrais.' },
      { title: 'Saneamento (Águas de Teresina)', metric: '39% esgoto (2022) em expansão', detail: 'Receita direta anual de R$ 532,8M (DF 2025) sustentando investimentos de universalização do esgotamento sanitário e redução de perdas.' },
      { title: 'Arborização Urbana ("Cidade Verde")', metric: '58,16% das vias', detail: 'Censo 2022 IBGE aponta 58,16% das faces de quadra arborizadas e 172,26 km² de mancha urbana contínua entre os rios Parnaíba e Poti.' }
    ],
    swotTeresina: {
      strengths: [
        'Maior polo de Serviços (71,7% PIB estadual), Saúde de alta complexidade (HUT + rede privada) e Ensino Superior do Meio-Norte.',
        'Selo Ouro em Alfabetização (ICA 80,58%), IDEB Municipal 6,4 (AI) / 5,8 (AF) e 24 unidades de referência no catálogo INEP.',
        'Recuo forte da criminalidade (jan–mai/2026): -52,17% CVLI, -74,15% roubo de celulares e -86,75% receptação.',
        'Liderança em empregos formais (+9.646 vagas CAGED 2025 · 234,7 mil estoque) e 4ª cidade do Brasil em energia solar residencial.'
      ],
      weaknesses: [
        'Cobertura de esgotamento sanitário ainda em 39% (IBGE 2022), exigindo aceleração das metas de saneamento.',
        'Esvaziamento residencial do Centro (-23.066 habitantes entre 2010 e 2022) com subaproveitamento de imóveis urbanos.',
        '198.189 moradores em 170 favelas/comunidades urbanas (22,87% da cidade) e 26,7 mil pessoas historicamente em áreas de risco.',
        'Dependência de transferências correntes (65,99% da receita realizada em 2024) e gargalos históricos no transporte coletivo.'
      ],
      opportunities: [
        'Consolidação como Hub EdTech & IA com o Piauí Instituto de Tecnologia (PIT), SoberanIA e eventos nacionais como o Neon.',
        'Conclusão da modernização do Metrô/VLT (R$ 600 mi) integrando Grande Dirceu ao Centro em tempo competitivo.',
        'Reabilitação habitacional e tecnológica do Centro Histórico associada a moradia, economia criativa e segurança via SPIA.',
        'Integração metropolitana estruturada com Timon (MA) e municípios do TD4 Entre Rios.'
      ],
      threats: [
        'Ondas de calor extremo e baixa umidade no B-R-O Bró elevando estresse térmico urbano e demanda por saúde/energia.',
        'Subfinanciamento ou atrasos em repasses vinculados de Saúde (HUT/FMS) frente à demanda de todo o Meio-Norte.',
        'Concorrência fiscal e migração de talentos qualificados caso a renda média local não acompanhe hubs do Sudeste/Sul.',
        'Pressão sobre micro e pequenas empresas por custo de crédito com Selic elevada.'
      ]
    }
  }
};
