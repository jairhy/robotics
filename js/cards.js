/* =========================================================
   cards.js — carrega robots.json, renderiza cards e filtros
   ========================================================= */

let ROBOS = [];
let FILTRO_ATUAL = "todos";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("grid-robos");
  if (!grid) return;

  try {
    const resp = await fetch("data/robots.json");
    ROBOS = await resp.json();
    renderizarCards(ROBOS);
    inicializarFiltros();
  } catch (err) {
    grid.innerHTML =
      '<p style="text-align:center;color:#dc2626">Não foi possível carregar os dados dos robôs. Abra o site via servidor local (ex: <code>python -m http.server</code>).</p>';
    console.error(err);
  }
});

function renderizarCards(lista) {
  const grid = document.getElementById("grid-robos");
  grid.innerHTML = "";
  lista.forEach((r) => {
    const card = document.createElement("article");
    card.className = "card-robo reveal";
    card.dataset.tags = r.tags.join(",");
    card.innerHTML = `
      <div class="miniatura">
        <img src="${r.imagem}" alt="${r.nome}" loading="lazy" onerror="this.src='https://via.placeholder.com/640x400/0b1f3a/ffffff?text=${encodeURIComponent(r.nome)}'"/>
      </div>
      <div class="card-robo-conteudo">
        <h3>${r.nome}</h3>
        <p>${r.conceito}</p>
        <div class="card-robo-tags">
          ${r.tags.map((t) => `<span class="tag">${t.replace("-", " ")}</span>`).join("")}
        </div>
        <a class="btn btn-primario" href="robots.html?robo=${r.slug}">Saiba mais →</a>
      </div>
    `;
    grid.appendChild(card);
  });
  // Dispara animação
  requestAnimationFrame(() => {
    document.querySelectorAll(".card-robo").forEach((c, i) => {
      setTimeout(() => c.classList.add("visivel"), 60 * i);
    });
  });
}

function inicializarFiltros() {
  document.querySelectorAll(".chip[data-filtro]").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip[data-filtro]").forEach((c) => c.classList.remove("ativo"));
      chip.classList.add("ativo");
      FILTRO_ATUAL = chip.dataset.filtro;
      const filtrados =
        FILTRO_ATUAL === "todos"
          ? ROBOS
          : ROBOS.filter((r) => r.tags.includes(FILTRO_ATUAL));
      renderizarCards(filtrados);
    });
  });
}
