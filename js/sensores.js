/* =========================================================
   sensores.js — Lógica da página Catálogo de Sensores IoT
   Busca, filtros, modal de detalhes, simuladores interativos
   e quiz "Qual sensor eu preciso?"
   ========================================================= */

/* ---------------- Ícones SVG minimalistas ---------------- */
function iconeSVG(chave) {
  const icones = {
    termometro: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14 14.76V4a2 2 0 0 0-4 0v10.76a4 4 0 1 0 4 0z"/><line x1="12" y1="8" x2="12" y2="14"/></svg>`,
    "termometro-agua": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14 14.76V4a2 2 0 0 0-4 0v10.76a4 4 0 1 0 4 0z"/><path d="M4 19c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" opacity=".6"/></svg>`,
    sol: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
    ondas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 12a5 5 0 0 1 0-6M6 15a9 9 0 0 1 0-12M22 12a5 5 0 0 0 0-6M18 15a9 9 0 0 0 0-12"/><circle cx="12" cy="12" r="2.3"/></svg>`,
    movimento: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="6" r="2.2"/><path d="M12 8.5v5l-3 6M12 13.5l3 6M8.5 12h7"/></svg>`,
    proximidade: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="9" width="8" height="6" rx="1"/><path d="M14 10c2 .6 2 3.4 0 4M17 8c3.5 1.3 3.5 6.7 0 8"/></svg>`,
    gas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 21c-2 0-3-1.3-3-3 0-2 2-2.4 2-4.5C7 11 5.5 10 5.5 8c0-2.2 2-3.5 2-5.5"/><path d="M14 21c-2 0-3-1.3-3-3 0-2 2-2.4 2-4.5 0-2.5-1.5-3.5-1.5-5.5 0-2.2 2-3.5 2-5.5"/><path d="M19 21c-1.6 0-2.4-1-2.4-2.4 0-1.6 1.6-2 1.6-3.6"/></svg>`,
    gota: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2.5c3.5 4.6 7 8.6 7 12.3a7 7 0 1 1-14 0c0-3.7 3.5-7.7 7-12.3z"/></svg>`,
    corrente: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 4 14 11 14 10 22 20 9 13 9 13 2"/></svg>`,
    rfid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.5" y="6" width="14" height="12" rx="2"/><path d="M18.5 9.5a4 4 0 0 1 0 5M21.3 7.5a7.5 7.5 0 0 1 0 9"/></svg>`
  };
  return icones[chave] || icones.ondas;
}

/* ---------------- Estado global ---------------- */
let filtroCategoria = "todos";
let filtroSinal = "todos";
let termoBusca = "";

/* ---------------- Renderização dos cards ---------------- */
function renderizarCards() {
  const grid = document.getElementById("grid-sensores");
  grid.innerHTML = SENSORES.map(s => `
    <article class="sensor-card reveal" data-id="${s.id}" data-categoria="${s.categoria}" data-sinal="${s.sinal}" data-nome="${s.nome.toLowerCase()}" data-fabricante="${s.fabricante.toLowerCase()}" data-aplicacoes="${s.aplicacoes.toLowerCase()}">
      <div class="sensor-icone">${iconeSVG(s.icone)}</div>
      <h3>${s.nome}</h3>
      <p class="sensor-resumo">${s.resumo}</p>
      <div class="sensor-badges">
        <span class="badge-categoria">${s.categoriaLabel}</span>
        <span class="badge-sinal">${s.sinalLabel}</span>
      </div>
      <button class="btn btn-outline" data-abrir="${s.id}">Explorar Detalhes →</button>
    </article>
  `).join("");

  grid.querySelectorAll("[data-abrir]").forEach(btn => {
    btn.addEventListener("click", () => abrirModal(btn.getAttribute("data-abrir")));
  });

  // Reobserva para animação de reveal
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); } });
  }, { threshold: .1 });
  grid.querySelectorAll(".sensor-card").forEach(el => io.observe(el));
}

function renderizarStats() {
  const categorias = new Set(SENSORES.map(s => s.categoria));
  const sinais = new Set(SENSORES.map(s => s.sinal));
  document.getElementById("stat-sensores").textContent = SENSORES.length;
  document.getElementById("stat-protocolos").textContent = sinais.size;
  document.getElementById("stat-categorias").textContent = categorias.size;
}

function aplicarFiltros() {
  const cards = document.querySelectorAll(".sensor-card");
  cards.forEach(c => {
    const okCategoria = filtroCategoria === "todos" || c.getAttribute("data-categoria") === filtroCategoria;
    const okSinal = filtroSinal === "todos" || c.getAttribute("data-sinal") === filtroSinal;
    const alvoBusca = `${c.getAttribute("data-nome")} ${c.getAttribute("data-fabricante")} ${c.getAttribute("data-aplicacoes")}`;
    const okBusca = !termoBusca || alvoBusca.includes(termoBusca);
    c.classList.toggle("oculto", !(okCategoria && okSinal && okBusca));
  });
}

function inicializarFiltros() {
  const busca = document.getElementById("busca-sensor");
  busca?.addEventListener("input", () => {
    termoBusca = busca.value.toLowerCase().trim();
    aplicarFiltros();
  });

  document.querySelectorAll("[data-filtro-categoria]").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("[data-filtro-categoria]").forEach(c => c.classList.remove("ativo"));
      chip.classList.add("ativo");
      filtroCategoria = chip.getAttribute("data-filtro-categoria");
      aplicarFiltros();
    });
  });

  document.querySelectorAll("[data-filtro-sinal]").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("[data-filtro-sinal]").forEach(c => c.classList.remove("ativo"));
      chip.classList.add("ativo");
      filtroSinal = chip.getAttribute("data-filtro-sinal");
      aplicarFiltros();
    });
  });
}

/* ---------------- Modal de detalhes técnicos ---------------- */
function abrirModal(id) {
  const s = SENSORES.find(x => x.id === id);
  if (!s) return;
  const modal = document.getElementById("modal-sensor");

  document.getElementById("modal-icone").innerHTML = iconeSVG(s.icone);
  document.getElementById("modal-titulo").textContent = s.nome;
  document.getElementById("modal-fabricante").textContent = "Fabricante: " + s.fabricante;
  document.getElementById("modal-conceito").textContent = s.conceito;
  document.getElementById("modal-principio").textContent = s.principio;
  document.getElementById("modal-aplicacoes").textContent = s.aplicacoes;

  document.getElementById("modal-specs").innerHTML = s.specs.map(sp =>
    `<tr><td>${sp.label}</td><td>${sp.value}</td></tr>`
  ).join("");

  document.getElementById("modal-pinagem").innerHTML = s.pinos.map(p =>
    `<div class="pino-item"><span class="pino-nome">${p.nome}</span><span class="pino-desc">${p.desc}</span></div>`
  ).join("");

  const codigoEl = document.getElementById("modal-codigo");
  codigoEl.textContent = s.codigo;

  const btnCopiar = document.getElementById("btn-copiar-codigo");
  btnCopiar.classList.remove("copiado");
  btnCopiar.textContent = "Copiar Código";
  btnCopiar.onclick = () => {
    navigator.clipboard.writeText(s.codigo).then(() => {
      btnCopiar.textContent = "Copiado!";
      btnCopiar.classList.add("copiado");
      setTimeout(() => { btnCopiar.textContent = "Copiar Código"; btnCopiar.classList.remove("copiado"); }, 2000);
    });
  };

  // Renderiza o simulador específico do sensor
  renderizarSimulador(s);

  modal.classList.add("aberto");
  document.body.style.overflow = "hidden";
}

function fecharModal() {
  document.getElementById("modal-sensor").classList.remove("aberto");
  document.body.style.overflow = "";
}

function inicializarModal() {
  const modal = document.getElementById("modal-sensor");
  document.getElementById("modal-fechar-btn").addEventListener("click", fecharModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) fecharModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharModal(); });
}

/* ---------------- Motor de Simuladores ---------------- */
function monitorEscrever(monitorEl, linha) {
  const linhas = monitorEl.textContent.split("\n").filter(Boolean);
  linhas.push(linha);
  while (linhas.length > 6) linhas.shift();
  monitorEl.textContent = linhas.join("\n");
  monitorEl.scrollTop = monitorEl.scrollHeight;
}

function renderizarSimulador(s) {
  const wrap = document.getElementById("modal-simulador");
  switch (s.simulador) {
    case "dht22": return simDHT22(wrap);
    case "ds18b20": return simDS18B20(wrap);
    case "ldr": return simLDR(wrap);
    case "hcsr04": return simHCSR04(wrap);
    case "pir": return simPIR(wrap);
    case "lj12a3": return simLJ12A3(wrap);
    case "mq135": return simMQ135(wrap);
    case "yfs201": return simYFS201(wrap);
    case "acs712": return simACS712(wrap);
    case "mfrc522": return simMFRC522(wrap);
    default: wrap.innerHTML = "";
  }
}

/* ---- DHT22: temperatura + umidade ---- */
function simDHT22(wrap) {
  wrap.innerHTML = `
    <div class="simulador-box">
      <div class="simulador-controles">
        <label>Temperatura <span id="dht-temp-val">24°C</span><input type="range" id="dht-temp" min="-10" max="50" value="24"></label>
        <label>Umidade <span id="dht-umid-val">55%</span><input type="range" id="dht-umid" min="0" max="100" value="55"></label>
        <div class="serial-monitor" id="dht-monitor">Aguardando leitura...</div>
      </div>
      <div class="simulador-visual">
        <svg viewBox="0 0 80 160" width="90" height="180">
          <rect x="30" y="10" width="20" height="100" rx="10" fill="none" stroke="var(--borda)" stroke-width="2"/>
          <circle cx="40" cy="130" r="18" fill="none" stroke="var(--borda)" stroke-width="2"/>
          <rect id="dht-mercurio" x="34" y="60" width="12" height="60" fill="#1e6fd9" rx="6"/>
          <circle cx="40" cy="130" r="12" fill="#1e6fd9"/>
        </svg>
      </div>
    </div>`;
  const temp = wrap.querySelector("#dht-temp");
  const umid = wrap.querySelector("#dht-umid");
  const monitor = wrap.querySelector("#dht-monitor");
  const mercurio = wrap.querySelector("#dht-mercurio");
  function atualizar() {
    const t = parseFloat(temp.value), u = parseFloat(umid.value);
    wrap.querySelector("#dht-temp-val").textContent = t + "°C";
    wrap.querySelector("#dht-umid-val").textContent = u + "%";
    const alturaMax = 60, y = 120 - ((t + 10) / 60) * alturaMax;
    mercurio.setAttribute("y", Math.max(60, y));
    mercurio.setAttribute("height", 120 - Math.max(60, y));
    monitorEscrever(monitor, `Umidade: ${u.toFixed(1)} % | Temp: ${t.toFixed(1)} °C`);
  }
  temp.addEventListener("input", atualizar);
  umid.addEventListener("input", atualizar);
  atualizar();
}

/* ---- DS18B20: sonda em líquido ---- */
function simDS18B20(wrap) {
  wrap.innerHTML = `
    <div class="simulador-box">
      <div class="simulador-controles">
        <label>Temperatura do tanque <span id="ds-val">35°C</span><input type="range" id="ds-temp" min="-20" max="100" value="35"></label>
        <div class="serial-monitor" id="ds-monitor">Aguardando leitura...</div>
      </div>
      <div class="simulador-visual">
        <svg viewBox="0 0 100 120" width="110" height="130">
          <rect x="15" y="10" width="70" height="90" rx="8" fill="none" stroke="var(--borda)" stroke-width="2"/>
          <rect id="ds-liquido" x="17" y="60" width="66" height="38" fill="#06b6d4" opacity=".5"/>
          <line x1="50" y1="0" x2="50" y2="70" stroke="var(--texto-suave)" stroke-width="4"/>
          <circle id="ds-ponta" cx="50" cy="72" r="6" fill="#1e6fd9"/>
        </svg>
      </div>
    </div>`;
  const temp = wrap.querySelector("#ds-temp");
  const monitor = wrap.querySelector("#ds-monitor");
  const ponta = wrap.querySelector("#ds-ponta");
  function atualizar() {
    const t = parseFloat(temp.value);
    wrap.querySelector("#ds-val").textContent = t + "°C";
    const cor = t < 15 ? "#1e6fd9" : t < 50 ? "#06b6d4" : "#dc2626";
    ponta.setAttribute("fill", cor);
    monitorEscrever(monitor, `Temperatura do Tanque: ${t.toFixed(1)} °C`);
  }
  temp.addEventListener("input", atualizar);
  atualizar();
}

/* ---- LDR: sol a escuridão ---- */
function simLDR(wrap) {
  wrap.innerHTML = `
    <div class="simulador-box">
      <div class="simulador-controles">
        <label>Luminosidade <span id="ldr-val">Sol ☀️</span><input type="range" id="ldr-luz" min="0" max="100" value="80"></label>
        <div class="serial-monitor" id="ldr-monitor">Aguardando leitura...</div>
      </div>
      <div class="simulador-visual">
        <svg viewBox="0 0 100 100" width="110" height="110">
          <circle id="ldr-luzcirculo" cx="50" cy="50" r="45" fill="#fde68a" opacity=".2"/>
          <path d="M50 30 L45 60 L55 60 L50 90" fill="none" stroke="#eab308" stroke-width="3" stroke-linejoin="round" id="ldr-lampada"/>
          <circle cx="50" cy="25" r="8" fill="none" stroke="#eab308" stroke-width="3" id="ldr-bulbo"/>
        </svg>
      </div>
    </div>`;
  const luz = wrap.querySelector("#ldr-luz");
  const monitor = wrap.querySelector("#ldr-monitor");
  const bulbo = wrap.querySelector("#ldr-bulbo");
  const halo = wrap.querySelector("#ldr-luzcirculo");
  function atualizar() {
    const l = parseFloat(luz.value);
    wrap.querySelector("#ldr-val").textContent = l > 50 ? "Sol ☀️" : "Escuridão 🌙";
    const ldrRaw = Math.round(((100 - l) / 100) * 1023);
    const tensao = (ldrRaw * (5 / 1023)).toFixed(2);
    const ligado = ldrRaw < 400;
    bulbo.setAttribute("fill", ligado ? "#fde047" : "none");
    halo.setAttribute("opacity", ligado ? ".55" : ".08");
    monitorEscrever(monitor, `ADC: ${ldrRaw} | Tensao: ${tensao}V | Rele: ${ligado ? "LIGADO" : "DESLIGADO"}`);
  }
  luz.addEventListener("input", atualizar);
  atualizar();
}

/* ---- HC-SR04: distância ---- */
function simHCSR04(wrap) {
  wrap.innerHTML = `
    <div class="simulador-box">
      <div class="simulador-controles">
        <label>Distância <span id="hc-val">50 cm</span><input type="range" id="hc-dist" min="2" max="400" value="50"></label>
        <div class="serial-monitor" id="hc-monitor">Aguardando leitura...</div>
      </div>
      <div class="simulador-visual">
        <svg viewBox="0 0 220 60" width="230" height="70">
          <rect x="0" y="20" width="24" height="20" fill="#1e6fd9" rx="3"/>
          <path d="M28 30 h4 M36 30 h4 M44 30 h4" stroke="#06b6d4" stroke-width="2" stroke-dasharray="2 2"/>
          <rect id="hc-obstaculo" x="180" y="10" width="10" height="40" fill="var(--texto-suave)" rx="2"/>
        </svg>
      </div>
    </div>`;
  const dist = wrap.querySelector("#hc-dist");
  const monitor = wrap.querySelector("#hc-monitor");
  const obst = wrap.querySelector("#hc-obstaculo");
  function atualizar() {
    const d = parseFloat(dist.value);
    wrap.querySelector("#hc-val").textContent = d + " cm";
    const x = 24 + (d / 400) * 160;
    obst.setAttribute("x", Math.min(200, x));
    const duracaoUs = Math.round((d * 2) / 0.0343);
    const distCalc = ((duracaoUs * 0.0343) / 2).toFixed(1);
    monitorEscrever(monitor, `Pulso ECHO: ${duracaoUs}us | Distancia: ${distCalc} cm`);
  }
  dist.addEventListener("input", atualizar);
  atualizar();
}

/* ---- PIR: botão simular movimento ---- */
function simPIR(wrap) {
  wrap.innerHTML = `
    <div class="simulador-box">
      <div class="simulador-controles">
        <button class="btn-simular" id="pir-btn">🚶 Simular Movimento</button>
        <div class="serial-monitor" id="pir-monitor">Sistema Ativo. Aguardando movimento...</div>
      </div>
      <div class="simulador-visual">
        <svg viewBox="0 0 100 100" width="110" height="110">
          <circle id="pir-alerta" cx="50" cy="50" r="42" fill="#dc2626" opacity="0"/>
          <path d="M20 60 L50 20 L80 60 Z" fill="none" stroke="var(--texto-suave)" stroke-width="3"/>
          <circle cx="50" cy="40" r="6" fill="var(--texto-suave)"/>
        </svg>
      </div>
    </div>`;
  const btn = wrap.querySelector("#pir-btn");
  const monitor = wrap.querySelector("#pir-monitor");
  const alerta = wrap.querySelector("#pir-alerta");
  btn.addEventListener("click", () => {
    btn.disabled = true;
    alerta.setAttribute("opacity", ".55");
    monitorEscrever(monitor, "ALERTA: INTRUSO DETECTADO NO CAMPO COBERTO! (HIGH)");
    setTimeout(() => {
      alerta.setAttribute("opacity", "0");
      monitorEscrever(monitor, "Sinal normalizado (LOW)");
      btn.disabled = false;
    }, 1800);
  });
}

/* ---- LJ12A3: proximidade indutiva ---- */
function simLJ12A3(wrap) {
  wrap.innerHTML = `
    <div class="simulador-box">
      <div class="simulador-controles">
        <label>Distância até o metal <span id="lj-val">2 mm</span><input type="range" id="lj-dist" min="0" max="15" value="2"></label>
        <div class="serial-monitor" id="lj-monitor">Aguardando leitura...</div>
      </div>
      <div class="simulador-visual">
        <svg viewBox="0 0 160 60" width="170" height="70">
          <rect x="0" y="15" width="30" height="30" fill="#334155" rx="4"/>
          <rect id="lj-metal" x="90" y="10" width="14" height="40" fill="#94a3b8"/>
        </svg>
      </div>
    </div>`;
  const dist = wrap.querySelector("#lj-dist");
  const monitor = wrap.querySelector("#lj-monitor");
  const metal = wrap.querySelector("#lj-metal");
  function atualizar() {
    const d = parseFloat(dist.value);
    wrap.querySelector("#lj-val").textContent = d + " mm";
    metal.setAttribute("x", 34 + d * 6);
    const detectado = d <= 4;
    metal.setAttribute("fill", detectado ? "#059669" : "#94a3b8");
    monitorEscrever(monitor, detectado ? "ATENÇÃO: Peça Metálica Identificada! (LOW)" : "Nenhum metal (HIGH)");
  }
  dist.addEventListener("input", atualizar);
  atualizar();
}

/* ---- MQ-135: gases ---- */
function simMQ135(wrap) {
  wrap.innerHTML = `
    <div class="simulador-box">
      <div class="simulador-controles">
        <label>Concentração de gás <span id="mq-val">120 ppm</span><input type="range" id="mq-ppm" min="0" max="1000" value="120"></label>
        <div class="serial-monitor" id="mq-monitor">Condições de Ar Seguras</div>
      </div>
      <div class="simulador-visual">
        <svg viewBox="0 0 100 60" width="140" height="84">
          <path d="M10 55 A40 40 0 0 1 90 55" fill="none" stroke="var(--borda)" stroke-width="8"/>
          <line id="mq-ponteiro" x1="50" y1="55" x2="50" y2="20" stroke="#dc2626" stroke-width="3"/>
          <circle cx="50" cy="55" r="4" fill="var(--texto)"/>
        </svg>
      </div>
    </div>`;
  const ppm = wrap.querySelector("#mq-ppm");
  const monitor = wrap.querySelector("#mq-monitor");
  const ponteiro = wrap.querySelector("#mq-ponteiro");
  function atualizar() {
    const p = parseFloat(ppm.value);
    wrap.querySelector("#mq-val").textContent = p + " ppm";
    const angulo = -90 + (p / 1000) * 180;
    const rad = (angulo * Math.PI) / 180;
    ponteiro.setAttribute("x2", 50 + 35 * Math.sin(rad));
    ponteiro.setAttribute("y2", 55 - 35 * Math.cos(rad));
    const alerta = p > 600;
    monitorEscrever(monitor, alerta ? `Nivel: ${p} [ALERTA: AR TOXICO DETECTADO!]` : `Nivel: ${p} [Condicoes de Ar Seguras]`);
  }
  ppm.addEventListener("input", atualizar);
  atualizar();
}

/* ---- YF-S201: vazão ---- */
function simYFS201(wrap) {
  wrap.innerHTML = `
    <div class="simulador-box">
      <div class="simulador-controles">
        <label>Vazão <span id="yf-val">10 L/min</span><input type="range" id="yf-fluxo" min="0" max="30" value="10"></label>
        <div class="serial-monitor" id="yf-monitor">Aguardando leitura...</div>
      </div>
      <div class="simulador-visual">
        <svg viewBox="0 0 100 100" width="110" height="110">
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--borda)" stroke-width="3"/>
          <g id="yf-rotor">
            <line x1="50" y1="15" x2="50" y2="85" stroke="#1e6fd9" stroke-width="4"/>
            <line x1="15" y1="50" x2="85" y2="50" stroke="#1e6fd9" stroke-width="4"/>
          </g>
        </svg>
      </div>
    </div>`;
  const fluxo = wrap.querySelector("#yf-fluxo");
  const monitor = wrap.querySelector("#yf-monitor");
  const rotor = wrap.querySelector("#yf-rotor");
  function atualizar() {
    const q = parseFloat(fluxo.value);
    wrap.querySelector("#yf-val").textContent = q + " L/min";
    const freq = (7.5 * q).toFixed(1);
    const duracao = q > 0 ? Math.max(0.3, 4 / q) : 0;
    rotor.style.animation = q > 0 ? `girar ${duracao}s linear infinite` : "none";
    monitorEscrever(monitor, `Pulsos/s: ${freq} | Vazão Atual: ${q.toFixed(1)} L/min`);
  }
  fluxo.addEventListener("input", atualizar);
  atualizar();
}

/* ---- ACS712: corrente elétrica ---- */
function simACS712(wrap) {
  wrap.innerHTML = `
    <div class="simulador-box">
      <div class="simulador-controles">
        <label>Corrente <span id="acs-val">5.0 A</span><input type="range" id="acs-corrente" min="-20" max="20" value="5" step="0.5"></label>
        <div class="serial-monitor" id="acs-monitor">Aguardando leitura...</div>
      </div>
      <div class="simulador-visual">
        <svg viewBox="0 0 140 40" width="160" height="50">
          <rect x="2" y="15" width="136" height="10" rx="5" fill="var(--borda)"/>
          <rect id="acs-barra" x="68" y="15" width="2" height="10" rx="5" fill="#1e6fd9"/>
          <line x1="70" y1="5" x2="70" y2="35" stroke="var(--texto-suave)" stroke-width="1" stroke-dasharray="2 2"/>
        </svg>
      </div>
    </div>`;
  const corrente = wrap.querySelector("#acs-corrente");
  const monitor = wrap.querySelector("#acs-monitor");
  const barra = wrap.querySelector("#acs-barra");
  function atualizar() {
    const i = parseFloat(corrente.value);
    wrap.querySelector("#acs-val").textContent = i.toFixed(1) + " A";
    const tensao = (2.5 + i * 0.1).toFixed(3);
    const largura = Math.abs(i) * 3;
    barra.setAttribute("x", i >= 0 ? 70 : 70 - largura);
    barra.setAttribute("width", Math.max(2, largura));
    monitorEscrever(monitor, `Tensao do Sensor: ${tensao} V | Corrente Real: ${i.toFixed(1)} A`);
  }
  corrente.addEventListener("input", atualizar);
  atualizar();
}

/* ---- MFRC522: leitura de tag RFID ---- */
function simMFRC522(wrap) {
  wrap.innerHTML = `
    <div class="simulador-box">
      <div class="simulador-controles">
        <button class="btn-simular" id="rfid-btn">📶 Simular Aproximação de Tag</button>
        <div class="serial-monitor" id="rfid-monitor">Leitor RFID Ativo. Aproxime a sua Tag...</div>
      </div>
      <div class="simulador-visual">
        <svg viewBox="0 0 100 70" width="140" height="98">
          <rect x="10" y="15" width="50" height="35" rx="4" fill="none" stroke="var(--texto-suave)" stroke-width="2"/>
          <rect id="rfid-tag" x="-40" y="20" width="34" height="24" rx="3" fill="#1e6fd9"/>
        </svg>
      </div>
    </div>`;
  const btn = wrap.querySelector("#rfid-btn");
  const monitor = wrap.querySelector("#rfid-monitor");
  const tag = wrap.querySelector("#rfid-tag");
  btn.addEventListener("click", () => {
    btn.disabled = true;
    tag.style.transition = "x 700ms ease";
    tag.setAttribute("x", 20);
    const uid = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase()).join(" ");
    setTimeout(() => {
      monitorEscrever(monitor, `Código UID Identificado: ${uid}`);
    }, 700);
    setTimeout(() => {
      tag.setAttribute("x", -40);
      btn.disabled = false;
    }, 1800);
  });
}

/* ---------------- Quiz: Qual sensor eu preciso? ---------------- */
const quizRespostas = { medir: null, severo: null, contato: null };

function inicializarQuiz() {
  const opcoesMedir = document.querySelectorAll('[data-quiz="medir"]');
  const opcoesSevero = document.querySelectorAll('[data-quiz="severo"]');
  const opcoesContato = document.querySelectorAll('[data-quiz="contato"]');

  opcoesMedir.forEach(op => op.addEventListener("click", () => {
    opcoesMedir.forEach(o => o.classList.remove("selecionada"));
    op.classList.add("selecionada");
    quizRespostas.medir = op.getAttribute("data-valor");
    setTimeout(() => irParaPasso(2), 250);
  }));
  opcoesSevero.forEach(op => op.addEventListener("click", () => {
    opcoesSevero.forEach(o => o.classList.remove("selecionada"));
    op.classList.add("selecionada");
    quizRespostas.severo = op.getAttribute("data-valor");
    setTimeout(() => irParaPasso(3), 250);
  }));
  opcoesContato.forEach(op => op.addEventListener("click", () => {
    opcoesContato.forEach(o => o.classList.remove("selecionada"));
    op.classList.add("selecionada");
    quizRespostas.contato = op.getAttribute("data-valor");
    setTimeout(() => calcularResultadoQuiz(), 250);
  }));

  document.querySelectorAll(".quiz-voltar").forEach(btn => {
    btn.addEventListener("click", () => irParaPasso(parseInt(btn.getAttribute("data-voltar"))));
  });
}

function irParaPasso(n) {
  document.querySelectorAll(".quiz-passo").forEach(p => p.classList.remove("ativo"));
  document.getElementById("quiz-passo-" + n).classList.add("ativo");
  document.querySelectorAll(".quiz-progresso span").forEach((el, i) => {
    el.classList.toggle("ativo", i < n);
  });
}

function calcularResultadoQuiz() {
  const { medir, severo, contato } = quizRespostas;
  let idRecomendado = "dht22";

  if (medir === "temperatura") {
    idRecomendado = severo === "sim" ? "ds18b20" : "dht22";
  } else if (medir === "distancia") {
    idRecomendado = severo === "sim" ? "lj12a3" : "hcsr04";
  } else if (medir === "presenca") {
    idRecomendado = "pir";
  } else if (medir === "gas") {
    idRecomendado = "mq135";
  } else if (medir === "fluido") {
    idRecomendado = "yfs201";
  } else if (medir === "eletricidade") {
    idRecomendado = "acs712";
  } else if (medir === "luminosidade") {
    idRecomendado = "ldr";
  } else if (medir === "identificacao") {
    idRecomendado = "mfrc522";
  }

  const s = SENSORES.find(x => x.id === idRecomendado);
  document.getElementById("quiz-resultado-icone").innerHTML = iconeSVG(s.icone);
  document.getElementById("quiz-resultado-nome").textContent = s.nome;
  document.getElementById("quiz-resultado-resumo").textContent = s.resumo;
  document.getElementById("quiz-resultado-abrir").onclick = () => {
    fecharQuizScrollAndOpen(s.id);
  };
  irParaPasso(4);
}

function fecharQuizScrollAndOpen(id) {
  abrirModal(id);
}

function reiniciarQuiz() {
  quizRespostas.medir = null; quizRespostas.severo = null; quizRespostas.contato = null;
  document.querySelectorAll(".quiz-opcao").forEach(o => o.classList.remove("selecionada"));
  irParaPasso(1);
}

/* ---------------- Inicialização geral da página ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderizarStats();
  renderizarCards();
  inicializarFiltros();
  inicializarModal();
  inicializarQuiz();
  document.getElementById("quiz-reiniciar")?.addEventListener("click", reiniciarQuiz);
});
