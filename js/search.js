/* =========================================================
   search.js — busca dinâmica por robôs + scroll até resultado
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("busca-robo");
  if (!input) return;

  input.addEventListener("input", () => {
    const termo = input.value.trim().toLowerCase();
    if (!termo) {
      document.querySelectorAll(".card-robo").forEach((c) => (c.style.display = ""));
      return;
    }
    let primeiro = null;
    document.querySelectorAll(".card-robo").forEach((card) => {
      const texto = card.textContent.toLowerCase();
      const match = texto.includes(termo);
      card.style.display = match ? "" : "none";
      if (match && !primeiro) primeiro = card;
    });
    if (primeiro) {
      primeiro.scrollIntoView({ behavior: "smooth", block: "center" });
      primeiro.classList.add("destacado");
      setTimeout(() => primeiro.classList.remove("destacado"), 1600);
    }
  });

  // Enter → navega para página do primeiro robô visível se existir link
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const primeiro = document.querySelector('.card-robo:not([style*="display: none"]) a.btn');
      if (primeiro) window.location.href = primeiro.href;
    }
  });
});
