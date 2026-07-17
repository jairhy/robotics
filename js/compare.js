/* =========================================================
   compare.js — monta a tabela comparativa a partir de robots.json
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  const alvo = document.getElementById("tabela-comparacao");
  if (!alvo) return;
  try {
    const resp = await fetch("data/robots.json");
    const robos = await resp.json();
    alvo.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Tipo de Robô</th>
            <th>Velocidade</th>
            <th>Carga útil</th>
            <th>Precisão / Repetibilidade</th>
            <th>Graus de liberdade</th>
            <th>Aplicações típicas</th>
          </tr>
        </thead>
        <tbody>
          ${robos.map((r) => `
            <tr>
              <td><a href="robots.html?robo=${r.slug}"><strong>${r.nome}</strong></a></td>
              <td>${r.caracteristicas.velocidade}</td>
              <td>${r.caracteristicas.cargaUtil}</td>
              <td>${r.caracteristicas.precisao}</td>
              <td>${r.caracteristicas.gdl}</td>
              <td>${r.aplicacoes.slice(0,2).join("; ")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch (err) {
    alvo.innerHTML = '<p style="color:#dc2626">Não foi possível carregar a comparação.</p>';
  }
});
