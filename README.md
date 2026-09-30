# Robótica Industrial 4.0

Portal web estático (HTML5 + CSS3 + JavaScript puro) sobre **Robótica Industrial**, **Indústria 4.0** e **IoT**. Serve como catálogo técnico e educativo para estudantes, professores, profissionais de automação e empresas.

Todo o conteúdo técnico é baseado no relatório *"Morfologia, Cinemática e Aplicações Avançadas na Robótica Industrial e Colaborativa"* de **Jair Hyan Fernandes da Silva**.

## 🚀 Tecnologias

- **HTML5** semântico (`header`, `nav`, `main`, `section`, `article`, `footer`)
- **CSS3** com variáveis, Grid, Flexbox e Media Queries
- **JavaScript puro (Vanilla JS)** — sem frameworks, sem Bootstrap, sem React
- Dados em **JSON** (`data/robots.json`) carregados via `fetch`

## 📁 Estrutura de pastas

```
robotica-industrial/
├── index.html          # Home com hero, conceitos, cards e filtros
├── robots.html          # Página individual do robô (?robo=slug)
├── compare.html         # Tabela comparativa
├── sensores.html         # Catálogo de Sensores IoT & Indústria 4.0 (novo)
├── about.html           # Sobre o portal
│
├── css/
│   ├── style.css        # Design system + componentes
│   ├── responsive.css   # Media queries (mobile / tablet / desktop)
│   ├── animations.css   # Animações e reveal on scroll
│   └── sensores.css     # Estilos específicos da página de sensores IoT
│
├── js/
│   ├── script.js        # Init global (tema, reveal, modal, voltar-topo, accordion)
│   ├── menu.js           # Menu hambúrguer responsivo
│   ├── search.js         # Busca dinâmica com scroll até o resultado
│   ├── cards.js           # Renderiza cards da home + filtros
│   ├── compare.js         # Monta tabela comparativa
│   ├── robot-detail.js    # Página individual de cada robô
│   ├── sensors-data.js    # Base de dados dos 10 sensores IoT
│   └── sensores.js        # Busca, filtros, modal, simuladores e quiz de sensores
│
├── images/
│   ├── industrialRobo.jpg # Imagem de destaque do hero
│   ├── cartesiano.jpg
│   ├── scara.jpg
│   ├── delta.jpg
│   ├── cilindrico.jpg
│   ├── esferico.jpg
│   ├── articulado.jpg
│   └── cobot.jpg
│
├── data/
│   └── robots.json       # Base de dados dos 7 robôs
│
└── README.md
```

## ▶️ Como executar

Como o site consome `data/robots.json` via `fetch`, você precisa servi-lo por um servidor HTTP (arquivo local `file://` bloqueia `fetch`).

**Opção 1 — Python**
```bash
cd robotica-industrial
python -m http.server 8080
```

**Opção 2 — Node.js**
```bash
npx serve .
```

**Opção 3 — VS Code**
Instale a extensão *Live Server* e clique em **Go Live**.

Abra `http://localhost:8080` no navegador.

## ✨ Funcionalidades

- Menu fixo com **hambúrguer** responsivo
- **Tema claro/escuro** persistido em `localStorage`
- **Busca dinâmica** com scroll suave até o robô encontrado
- **Filtros** por: alta velocidade, alta precisão, alta carga, soldagem, montagem, pintura, paletização, colaborativo
- **Cards animados** ao rolar (IntersectionObserver)
- **Modal** para ampliar imagens
- **Accordion** para perguntas frequentes
- **Botão voltar ao topo**
- **Tabela comparativa** entre todas as morfologias
- Página individual por robô com: conceito, funcionamento, cinemática, envelope, características, vantagens, limitações, aplicações, integração IoT (CLP/SCADA/MES/ERP) e fabricantes

## 🤖 Robôs cobertos

1. **Cartesiano (Gantry)** — PPP
2. **SCARA** — RRP
3. **Articulado (Antropomórfico)** — 6-DoF RRRRRR
4. **Cilíndrico** — RPP
5. **Delta (Paralelo)** — cadeia fechada
6. **Polar (Esférico)** — RRP esférica
7. **Colaborativo (Cobot)** — 6/7-DoF, ISO/TS 15066

## 🔌 Catálogo de Sensores IoT (`sensores.html`)

Página adicional que herda 100% da identidade visual do portal (header, footer, tema, tipografia e paleta), construída com HTML5 + Tailwind CSS (via CDN) + JavaScript puro, cobrindo:

- Ciclo de malha fechada Sensor → Controlador → Atuador e diagrama do ecossistema Arduino (GPIOs, ADC 10 bits, I2C, SPI, UART).
- Dashboard com busca em tempo real, filtros por categoria e por tipo de sinal, e cards estatísticos.
- 10 sensores: DHT22, DS18B20, LDR, HC-SR04, PIR HC-SR501, LJ12A3-4-Z/BX, MQ-135, YF-S201, ACS712 e MFRC522.
- Modal de detalhes com conceito, princípio físico, tabela de especificações, diagrama de pinagem, aplicações industriais e código Arduino C++ com botão "Copiar Código".
- Simulador interativo específico para cada sensor (sliders, monitor serial simulado, indicadores visuais em SVG).
- Assistente "Qual sensor eu preciso?" — quiz de 3 perguntas que recomenda o sensor ideal.

Todos os dados dos sensores ficam embutidos em `js/sensors-data.js` (sem necessidade de `fetch`), então a página funciona mesmo abrindo o arquivo `.html` diretamente (`file://`), sem precisar de servidor.

## 📱 Responsividade

Testado em desktop, notebook, tablet e celular usando Grid + Flexbox + Media Queries em `css/responsive.css`.

## 📄 Licença

MIT — uso educacional e comercial permitido, mantendo o crédito.