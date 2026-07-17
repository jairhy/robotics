/* =========================================================
   menu.js — menu hambúrguer responsivo
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".hamburguer");
  const menu = document.querySelector(".nav-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    btn.setAttribute("aria-expanded", String(aberto));
    btn.textContent = aberto ? "✕" : "☰";
  });

  // Fecha ao clicar em link (mobile)
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (menu.classList.contains("aberto")) {
        menu.classList.remove("aberto");
        btn.textContent = "☰";
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });
});
