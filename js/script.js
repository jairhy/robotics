/* =========================================================
   script.js — inicialização global (reveal, voltar ao topo, tema, modal)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  inicializarTema();
  inicializarRevealAoRolar();
  inicializarVoltarAoTopo();
  inicializarModalImagens();
  inicializarAccordion();
  marcarLinkAtivo();
});

// --------- Tema claro/escuro ---------
function inicializarTema() {
  const btn = document.getElementById("toggle-tema");
  const salvo = localStorage.getItem("tema") || "claro";
  document.documentElement.setAttribute("data-tema", salvo);
  atualizarIconeTema(btn, salvo);
  if (!btn) return;
  btn.addEventListener("click", () => {
    const atual = document.documentElement.getAttribute("data-tema") === "escuro" ? "claro" : "escuro";
    document.documentElement.setAttribute("data-tema", atual);
    localStorage.setItem("tema", atual);
    atualizarIconeTema(btn, atual);
  });
}
function atualizarIconeTema(btn, tema) {
  if (btn) btn.textContent = tema === "escuro" ? "☀️" : "🌙";
}

// --------- Animações ao rolar ---------
function inicializarRevealAoRolar() {
  const alvos = document.querySelectorAll(".reveal, .card-robo");
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visivel");
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  alvos.forEach((el) => io.observe(el));
}

// --------- Botão voltar ao topo ---------
function inicializarVoltarAoTopo() {
  const btn = document.getElementById("voltar-topo");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visivel", window.scrollY > 500);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// --------- Modal de imagens ---------
function inicializarModalImagens() {
  const modal = document.getElementById("modal-imagem");
  if (!modal) return;
  const img = modal.querySelector("img");
  const fechar = modal.querySelector(".modal-fechar");

  document.querySelectorAll("[data-zoom]").forEach((el) => {
    el.addEventListener("click", () => {
      img.src = el.getAttribute("src") || el.getAttribute("data-zoom");
      img.alt = el.getAttribute("alt") || "";
      modal.classList.add("aberto");
    });
  });
  fechar.addEventListener("click", () => modal.classList.remove("aberto"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("aberto"); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") modal.classList.remove("aberto"); });
}

// --------- Accordion (FAQ) ---------
function inicializarAccordion() {
  document.querySelectorAll(".accordion-item").forEach((item) => {
    const h = item.querySelector(".accordion-header");
    if (!h) return;
    h.addEventListener("click", () => item.classList.toggle("aberto"));
  });
}

// --------- Link ativo no menu ---------
function marcarLinkAtivo() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("ativo");
  });
}
