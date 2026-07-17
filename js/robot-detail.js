/* =========================================================
   robot-detail.js — renderiza a página individual de um robô
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("robo-detalhe");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("robo") || "cartesiano";

  try {
    const resp = await fetch("data/robots.json");
    const robos = await resp.json();
    const r = robos.find((x) => x.slug === slug) || robos[0];
    document.title = `${r.nome} — Robótica Industrial 4.0`;
    render(r, robos);
  } catch (err) {
    container.innerHTML =
      '<p style="color:#dc2626">Não foi possível carregar. Abra o site via servidor local.</p>';
    console.error(err);
  }
});

function render(r, todos) {
  const container = document.getElementById("robo-detalhe");
  container.innerHTML = `
    <header class="robo-header">
      <div class="container">
        <nav class="breadcrumb"><a href="index.html">Home</a> › <a href="index.html#robos">Robôs</a> › <span>${r.nome}</span></nav>
        <div class="robo-hero-grid">
          <div>
            <h1>${r.nome}</h1>
            <p>${r.conceito}</p>
            <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem">
              ${r.tags.map((t) => `<span class="tag" style="background:rgba(255,255,255,.12);color:#fff">${t.replace("-", " ")}</span>`).join("")}
            </div>
          </div>
          <img src="${r.imagem}" alt="${r.nome}" data-zoom onerror="this.src='https://via.placeholder.com/800x600/0b1f3a/ffffff?text=${encodeURIComponent(r.nome)}'"/>
        </div>
      </div>
    </header>

    <section class="secao">
      <div class="container">
        <div class="robo-secoes">
          <div class="painel reveal"><h3>⚙️ Funcionamento</h3><p>${r.funcionamento}</p></div>
          <div class="painel reveal"><h3>📐 Princípio Cinemático</h3><p>${r.cinematica}</p></div>
          <div class="painel reveal"><h3>🌐 Envelope de Trabalho</h3><p>${r.envelope}</p></div>
          <div class="painel reveal">
            <h3>✅ Vantagens</h3>
            <ul>${r.vantagens.map((v) => `<li>${v}</li>`).join("")}</ul>
          </div>
          <div class="painel reveal">
            <h3>⚠️ Limitações</h3>
            <ul>${r.limitacoes.map((v) => `<li>${v}</li>`).join("")}</ul>
          </div>
          <div class="painel reveal">
            <h3>🏭 Aplicações Industriais</h3>
            <ul>${r.aplicacoes.map((v) => `<li>${v}</li>`).join("")}</ul>
          </div>
        </div>
      </div>
    </section>

    <section class="secao secao-alt">
      <div class="container">
        <div class="secao-titulo"><small>Especificações</small><h2>Características Técnicas</h2></div>
        <div class="tabela-wrap">
          <table>
            <thead><tr><th>Característica</th><th>Valor</th></tr></thead>
            <tbody>
              <tr><td>Carga útil</td><td>${r.caracteristicas.cargaUtil}</td></tr>
              <tr><td>Graus de liberdade</td><td>${r.caracteristicas.gdl}</td></tr>
              <tr><td>Precisão / Repetibilidade</td><td>${r.caracteristicas.precisao}</td></tr>
              <tr><td>Velocidade</td><td>${r.caracteristicas.velocidade}</td></tr>
              <tr><td>Faixa de operação</td><td>${r.caracteristicas.faixa}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="secao">
      <div class="container">
        <div class="secao-titulo"><small>Indústria 4.0</small><h2>Integração com IoT</h2></div>
        <div class="painel reveal" style="max-width:900px;margin:0 auto">
          <p>${r.iot}</p>
          <div class="robo-secoes" style="margin-top:1.5rem">
            <div class="painel"><h3>🔌 CLPs</h3><p>Comunicação via Profinet, EtherNet/IP, EtherCAT e Modbus TCP com CLPs Siemens, Rockwell, Mitsubishi e Schneider.</p></div>
            <div class="painel"><h3>📡 Sensores</h3><p>Encoders, sensores de força/torque, visão artificial e scanners de segurança conectados via barramento industrial.</p></div>
            <div class="painel"><h3>🖥️ SCADA / Supervisório</h3><p>Publica variáveis em OPC UA/MQTT para HMIs, Ignition, WinCC, iFIX e Wonderware.</p></div>
            <div class="painel"><h3>📊 MES</h3><p>Rastreabilidade de lote, OEE em tempo real, controle de produção e apontamento automático.</p></div>
            <div class="painel"><h3>🏢 ERP</h3><p>Sincroniza ordens de produção, consumo de matéria-prima e status com SAP, TOTVS, Oracle etc.</p></div>
            <div class="painel"><h3>☁️ Cloud / Digital Twin</h3><p>Envio de telemetria a nuvem (AWS IoT, Azure IoT Hub) e integração com gêmeos digitais.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="secao secao-alt">
      <div class="container">
        <div class="secao-titulo"><small>Mercado</small><h2>Fabricantes e Modelos Comerciais</h2></div>
        <div class="grid-fabricantes">
          ${r.fabricantes.map((f) => `
            <div class="fab-card reveal">
              <img src="${f.imagem}" alt="${f.nome}" onerror="this.src='https://via.placeholder.com/200x60/1e6fd9/ffffff?text=${encodeURIComponent(f.nome)}'"/>
              <h4>${f.nome}</h4>
              <div class="modelo">${f.modelo}</div>
              <p>${f.descricao}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <section class="secao">
      <div class="container" style="text-align:center">
        <h2>Explore outros robôs</h2>
        <div class="filtros" style="justify-content:center;margin:1.5rem 0">
          ${todos.filter((x) => x.slug !== r.slug).map((x) => `<a class="chip" href="robots.html?robo=${x.slug}">${x.nome}</a>`).join("")}
        </div>
        <a href="index.html" class="btn btn-outline">← Voltar à página inicial</a>
      </div>
    </section>
  `;
  // Re-inicializa reveal + modal para novos elementos
  document.querySelectorAll(".reveal").forEach((el) => {
    new IntersectionObserver((entries, io) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); }
      });
    }, { threshold: .12 }).observe(el);
  });
  // Modal para imagem principal
  const img = container.querySelector("[data-zoom]");
  const modal = document.getElementById("modal-imagem");
  if (img && modal) {
    img.addEventListener("click", () => {
      modal.querySelector("img").src = img.src;
      modal.classList.add("aberto");
    });
  }
}
