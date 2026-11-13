# Piauí Teresina Analytics v2 // Sala de Situação Gov-BR & Palantir C4ISR

Painel analítico de indicadores sobre o estado do Piauí e sua capital, Teresina, com ontologia estruturada, auditoria metodológica, simulador fiscal LRF, mapa GIS real (WGS84), integração direta com APIs públicas brasileiras em tempo real (IBGE, Banco Central SGS, Tesouro SICONFI, Open-Meteo) e módulo visual C4ISR (*Eye of God*).

**Site público:** [tgmidasx7.github.io/APP-PIAUI-THE/](https://tgmidasx7.github.io/APP-PIAUI-THE/) · **Edição Paralela Teresina Capital:** [`/teresina/`](teresina/) · **Modo dedicado Eye of God:** [`/eyeofgod/`](eyeofgod/)

**Relatório de entendimento:** [docs/relatorio-entendimento.md](docs/relatorio-entendimento.md)

> **Transparência e arquitetura híbrida (v2):** o núcleo de indicadores auditados está centralizado em `assets/ontology.js` com período, fonte, metodologia e registro de anomalias. Quando aberto em navegador conectado à internet, `assets/realtime-gov.js` consulta APIs públicas oficiais e `data/piaui-live.json` (atualizado a cada 6h via GitHub Actions). Sem conectividade externa ou em `file://`, o painel preserva automaticamente a base local auditada.

## O que o painel apresenta (v2)

| Recurso / Seção | Conteúdo implementado |
| --- | --- |
| Sala de Situação Gov-BR (`#govLiveBar`) | Telemetria em tempo real via IBGE Localidades (224 municípios), Projeção BR, Banco Central SGS (Selic, IPCA, USD/BRL), Tesouro SICONFI e clima/UV de Teresina (Open-Meteo) |
| Visão Geral + Auditoria | Indicadores corrigidos, gráficos Chart.js e **Detector de Anomalias & Divergências** (`assets/ontology.js`) |
| Geográfica + Explorador | Território, relevo, clima, os **12 Territórios de Desenvolvimento**, **Energia Renovável (3º no Brasil / ANEEL)**, MATOPIBA e **Explorador Territorial** dos 224 municípios |
| Demográfica | Censo 2022 vs Estimativas 2025, **pirâmide/estrutura etária (IBGE 2022)**, urbanização (69,6%) e ranking das **12 maiores cidades piauienses** |
| Geopolítica & Corredores | Resumo em linguagem simples, 4 corredores geoeconômicos (Litoral/H₂V/ZPE, MATOPIBA, Teresina e Semiárido), gráfico comparativo e matriz de choques × economia |
| Econômica, Commodities & LRF | PIB setorial, **Novo Caged 2025 (+21.022 vagas PI / +9.646 Teresina)**, **Petróleo (Brent/WTI), Soja, Milho, Ouro, IC-Br (BCB)** com conversão em R$/saca, cruzamentos e **Simulador What-If LRF (2025–2030)** |
| Educacional & Escolas | **Censo Escolar 2024–2026** (829.549 matr. totais / 698.725 públicas PI / 126.719 Teresina), **explorador de 27 escolas reais** com código INEP, **6 premiações verificadas**, simulador Tempo Integral × EPT e notícias ao vivo (**SEDUC-PI RSS** + **IBGE Educação**) |
| Segurança Pública (SSP-PI) | Série histórica **DataSSP / SSP-PI (2022–2026)** em Teresina e Piauí (-52,17% CVLI, -74,15% roubo celulares), menor índice de homicídios em 14 anos, **CellGuard (>11 mil celulares recuperados)** e **Pacto pela Ordem** |
| EdTech & Ecossistema IA | **Piauí IA (Prêmio Global UNESCO)**, **PIT Teresina (78 egressos em Graduação IA)**, **Canal Educação**, **Seduckathon**, **SoberanIA / ZPE Parnaíba** e simulador de conversão de talentos digitais |
| Desenvolvimento Humano | Evolução estadual do IDH (2000–2021), **ranking municipal de IDHM (PNUD/IPEA/FJP)** com Renda/Longevidade/Educação dos principais polos |
| SWOT & Matriz Cruzada | Forças, fraquezas, oportunidades, ameaças e **Matriz Estratégica Cruzada (SO, WO, ST, WT — 2025–2030)** |
| Edição Paralela Teresina (`/teresina/`) | Painel municipal completo (**IBGE 2211001**) espelhando as **14 abas** com **5 subdistritos urbanos (Sul, Leste, Norte, Sudeste, Centro)**, **170 favelas/comunidades (IBGE 2022)**, **LOA 2025 (R$ 5,668 bi) & SICONFI 2211001**, **24 escolas da capital**, **Segurança THE**, **Saúde SUS** e simulador fiscal municipal |
| SPIA | Catálogo de 30 vídeos públicos e laboratório demonstrativo para Teresina |
| Eye of God (`#eye-of-god` & `/eyeofgod/`) | Componente compartilhado (`mountEyeOfGod`) com GIS real de Teresina e Piauí (16 polos), grafo de ontologia interativo, 6 modos de câmera em Canvas, sensores Gov-BR e CLI unificada (`pib`, `pop`, `fiscal`, `edu`, `escolas`, `premios`, `seguranca`, `edtech`, `geo pi`, `mun`, `graph`, `govbr`, `anomalies`, `weather`, `macro`, `commodities`) |
| Terminal & OSINT | Snapshot automático (`data/piaui-live.json` via `scripts/sync_osint.mjs`), IBGE Notícias, feeds RSS e curadoria local de 50 notícias |
| Fontes & método | Portais institucionais, checklist de governança e exportação em CSV e **Dossiê JSON completo** |

## Como funciona

A aplicação é um site estático: o navegador abre `index.html`, que contém a estrutura, os dados e parte dos estilos e scripts. Os recursos complementares ficam em `assets/`. As abas são controladas no navegador e os gráficos são desenhados com [Chart.js 4.4.7](https://www.chartjs.org/), incluído localmente no projeto. As fontes visuais são carregadas do Google Fonts. Não há backend, banco de dados ou integração com APIs de indicadores no código atual.

O conteúdo principal aparece imediatamente, sem uma tela de carregamento obrigatória. O relógio usa o fuso `America/Fortaleza`; os indicadores são estáticos e o terminal também tenta consultar feeds de notícias. A busca pesquisa indicadores, detalhes e itens SWOT, e os favoritos são armazenados somente no navegador. O CSV exporta os valores exibidos nos cartões, não uma base oficial. Cada gráfico oferece uma tabela com seus dados, inclusive quando a biblioteca de gráficos não estiver disponível. As abas suportam navegação pelo teclado e links diretos por `#nome-da-aba`.

## Executar localmente

**Requisito:** navegador moderno; Python 3 é opcional para executar um servidor local. O Chart.js está incluído no projeto; as fontes externas são opcionais e usam fontes de reserva quando não houver conexão.

Na raiz do projeto, execute:

```bash
python3 -m http.server 8000
```

Acesse <http://localhost:8000/>. Para encerrar o servidor, use `Ctrl+C`. Também é possível abrir `index.html` diretamente no navegador. Se o arquivo local do Chart.js falhar, os gráficos são substituídos por uma mensagem e os valores continuam disponíveis em tabelas.

## Testes e verificação

Para executar todos os testes, instale Python 3 e Node.js 22 e rode:

```bash
npm ci
npm test
```

Os testes verificam estrutura, sintaxe e interações em um DOM simulado, incluindo navegação, busca, favoritos e a falha do Chart.js. O GitHub Actions executa essas verificações em pushes e pull requests. Para executar apenas os testes estruturais sem instalar pacotes, use `python3 -m unittest discover -s tests -v`.

Os testes **não** verificam a veracidade dos dados, a renderização real em todos os navegadores nem a acessibilidade completa. Mudanças devem receber revisão manual adicional.

## Terminal de notícias e SPIA

O terminal mostra as notícias uma a uma em uma janela com histórico rolável. Ao abrir a aba, tenta consultar os feeds RSS do [g1 Piauí](https://g1.globo.com/rss/g1/pi/piaui/) e do [Governo do Piauí](https://www.pi.gov.br/feed/) por meio do serviço externo RSS2JSON; enquanto a página estiver aberta, repete a tentativa a cada cinco minutos. O serviço e os feeds podem estar fora do ar, impor limites, atrasar ou bloquear acesso. A interface informa o resultado, preserva a última consulta da sessão e usa como alternativa a curadoria estática de 50 links em `assets/news.js`, consultada em 30/10/2026. A seleção respeita uma janela móvel de 12 meses; a quantidade pode diminuir e fontes podem modificar ou retirar notícias. A rotação pode ser pausada e o arquivo filtrado por assunto ou busca.

A aba SPIA é uma **demonstração**, sem acesso a câmeras oficiais de Teresina nem análise real por IA. O mural oferece 30 vídeos públicos do YouTube identificados pelo local verdadeiro; são fontes de terceiros, não necessariamente câmeras de segurança e não necessariamente ao vivo. As miniaturas e vídeos dependem do YouTube e podem estar indisponíveis, gravados, sujeitos a anúncios ou bloqueados para incorporação; cada tela oferece um link ao original. O laboratório de interpretação gera apenas exemplos fictícios, sem examinar vídeos. Ao abrir o mural, o navegador acessa as miniaturas do YouTube; ao abrir um vídeo, acessa o reprodutor do YouTube. Os gráficos incluem limitações e portais de referência, que não substituem a conferência individual dos indicadores existentes.

## Hospedagem e atualização

O repositório está configurado para publicar gratuitamente a raiz da branch `main` no GitHub Pages. Mudanças em uma branch de trabalho não aparecem no endereço público até serem integradas à `main` e a publicação terminar. O serviço está sujeito às condições e limites do GitHub; disponibilidade permanente não é garantida.

Veja [publicação e manutenção](docs/publicacao.md) para o fluxo de atualização e diagnóstico.

## Estrutura do repositório

```text
index.html                         Página principal (14 abas, 19 gráficos Chart.js), CSP/Referrer-Policy
teresina/index.html                Edição paralela Teresina Capital (14 abas, 11 gráficos, IBGE/SICONFI 2211001)
eyeofgod/index.html                Rota dedicada para o Eye of God (usa componente compartilhado)
assets/ontology.js                 Fonte única estruturada (Piauí + Teresina Capital, Segurança, EdTech, 27 escolas)
assets/realtime-gov.js             Cliente ao vivo Gov-BR (IBGE, BCB SGS, SICONFI PI & THE 2211001, Open-Meteo e snapshot)
assets/dashboard.js                Controlador do painel estadual (navegação, busca, favoritos, simuladores, gráficos)
assets/teresina-app.js             Controlador da edição paralela Teresina Capital (14 abas, 11 gráficos, LRF municipal)
assets/eye-of-god.js               Componente compartilhado Eye of God (GIS, grafo clicável, CLI e HUD)
assets/teresina-base.css / eye-of-god.css / enhancements.css Estilos escopados da v2, Capital e Sala Gov-BR
assets/news.js / cameras.js        Curadoria local de notícias e catálogo de telas públicas
data/piaui-live.json               Snapshot OSINT atualizado periodicamente via GitHub Actions
scripts/sync_osint.mjs             Coletor zero-backend Node 22 para APIs públicas e RSS direto (SEDUC-PI, SSP-PI)
.github/workflows/osint-sync.yml   Workflow agendado (a cada 6h) para atualizar data/piaui-live.json
.github/workflows/checks.yml       Verificações automáticas (Python unittest + Node JSDOM)
tests/                             9 testes estruturais (Python) + 17 testes de interação/v2/Teresina (JSDOM)
```

## Como contribuir

Leia [CONTRIBUTING.md](CONTRIBUTING.md), faça alterações focadas, execute os testes e revise a aplicação no navegador. Para alterar um indicador, registre a fonte primária específica, o período, a unidade, a data de consulta e eventuais cálculos, conforme [governança de dados](docs/dados.md).

O repositório não especifica uma licença de uso. Consulte o responsável antes de reutilizar ou redistribuir o projeto.
