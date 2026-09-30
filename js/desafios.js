/* =========================================================
   desafios.js — Interações da página de Desafios Arduino
   - Botões de copiar código
   - Simuladores das três lógicas de controle
   - Monitor serial simulado (Desafio 3)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Copiar código ---------- */
  document.querySelectorAll(".btn-copiar-cod").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const alvo = document.getElementById(btn.dataset.alvo);
      if (!alvo) return;
      try {
        await navigator.clipboard.writeText(alvo.textContent.trim());
        const original = btn.textContent;
        btn.textContent = "Copiado ✓";
        setTimeout(() => (btn.textContent = original), 1600);
      } catch (e) {
        btn.textContent = "Falhou";
        setTimeout(() => (btn.textContent = "Copiar código"), 1600);
      }
    });
  });

  /* =======================================================
     DESAFIO 1 — Iluminação Inteligente
     Presença + escuro -> LED ligado (intensidade conforme luz)
     ======================================================= */
  const d1Pir = document.getElementById("d1-presenca");
  const d1Ldr = document.getElementById("d1-luz");
  const d1LdrVal = document.getElementById("d1-luz-val");
  const d1Led = document.getElementById("d1-led");
  const d1Msg = document.getElementById("d1-msg");
  const D1_LIMITE = 400; // limiar de escuridão (0-1023)

  function atualizaD1() {
    if (!d1Pir) return;
    const presenca = d1Pir.value === "1";
    const luz = Number(d1Ldr.value);
    d1LdrVal.textContent = luz;
    d1Led.className = "led";
    let estado;
    if (!presenca) {
      estado = "Sem pessoa → LED <strong>desligado</strong>";
    } else if (luz < D1_LIMITE) {
      const forte = luz < D1_LIMITE / 2;
      d1Led.classList.add("on-branco");
      d1Led.style.opacity = forte ? "1" : ".55";
      estado = `Pessoa presente + ambiente escuro → LED <strong>ligado</strong> (${
        forte ? "intensidade máxima" : "intensidade reduzida"
      })`;
    } else {
      estado = "Pessoa presente + ambiente claro → LED <strong>desligado</strong>";
    }
    if (!d1Led.classList.contains("on-branco")) d1Led.style.opacity = "1";
    d1Msg.innerHTML = `LDR = ${luz} · Limiar = ${D1_LIMITE} · PIR = ${
      presenca ? "HIGH" : "LOW"
    }<br/>${estado}`;
  }
  [d1Pir, d1Ldr].forEach((el) => el && el.addEventListener("input", atualizaD1));
  atualizaD1();

  /* =======================================================
     DESAFIO 2 — Estacionamento Inteligente
     Potenciômetro define a distância limite (5–50 cm)
     ======================================================= */
  const d2Dist = document.getElementById("d2-distancia");
  const d2DistVal = document.getElementById("d2-distancia-val");
  const d2Pot = document.getElementById("d2-pot");
  const d2PotVal = document.getElementById("d2-pot-val");
  const d2Limite = document.getElementById("d2-limite-val");
  const d2Led = document.getElementById("d2-led");
  const d2Msg = document.getElementById("d2-msg");
  let d2Timer = null;

  function atualizaD2() {
    if (!d2Dist) return;
    const dist = Number(d2Dist.value);
    const pot = Number(d2Pot.value);
    const limite = Math.round(5 + (pot / 1023) * 45); // 5 a 50 cm
    d2DistVal.textContent = dist;
    d2PotVal.textContent = pot;
    d2Limite.textContent = limite;

    if (d2Timer) { clearInterval(d2Timer); d2Timer = null; }
    d2Led.className = "led";
    d2Led.style.opacity = "1";

    const metade = limite / 2;
    if (dist > limite) {
      d2Msg.innerHTML = `Objeto distante (${dist} cm > ${limite} cm) → LED <strong>desligado</strong>`;
    } else if (dist > metade) {
      // pisca cada vez mais rápido conforme aproxima
      const faixa = limite - metade;
      const prog = (limite - dist) / (faixa || 1); // 0..1
      const intervalo = Math.round(500 - prog * 420); // 500ms -> 80ms
      let on = false;
      d2Timer = setInterval(() => {
        on = !on;
        d2Led.className = on ? "led on-amarelo" : "led";
      }, intervalo);
      d2Msg.innerHTML = `Objeto se aproximando (${dist} cm) → LED <strong>piscando</strong> a cada ${intervalo} ms`;
    } else {
      d2Led.className = "led on-vermelho";
      d2Msg.innerHTML = `Objeto dentro da zona crítica (${dist} cm ≤ ${Math.round(
        metade
      )} cm) → LED <strong>ligado continuamente</strong>`;
    }
  }
  [d2Dist, d2Pot].forEach((el) => el && el.addEventListener("input", atualizaD2));
  atualizaD2();

  /* =======================================================
     DESAFIO 3 — Ambiente Inteligente (estufa)
     Verde = OK · Vermelho = temperatura alta · Amarelo = umidade baixa
     ======================================================= */
  const d3Temp = document.getElementById("d3-temp");
  const d3TempVal = document.getElementById("d3-temp-val");
  const d3Umid = document.getElementById("d3-umid");
  const d3UmidVal = document.getElementById("d3-umid-val");
  const d3Verde = document.getElementById("d3-led-verde");
  const d3Vermelho = document.getElementById("d3-led-vermelho");
  const d3Amarelo = document.getElementById("d3-led-amarelo");
  const d3Msg = document.getElementById("d3-msg");
  const d3Serial = document.getElementById("d3-serial");
  const TEMP_MAX = 30; // °C
  const UMID_MIN = 50; // %

  function atualizaD3() {
    if (!d3Temp) return;
    const t = Number(d3Temp.value);
    const u = Number(d3Umid.value);
    d3TempVal.textContent = t;
    d3UmidVal.textContent = u;

    const tempAlta = t > TEMP_MAX;
    const umidBaixa = u < UMID_MIN;

    d3Vermelho.className = "led" + (tempAlta ? " on-vermelho" : "");
    d3Amarelo.className = "led" + (umidBaixa ? " on-amarelo" : "");
    d3Verde.className = "led" + (!tempAlta && !umidBaixa ? " on-verde" : "");

    let estado;
    if (tempAlta && umidBaixa) estado = "ALERTA DUPLO: temperatura alta + umidade baixa (vermelho + amarelo piscando juntos)";
    else if (tempAlta) estado = "Temperatura acima do limite → LED vermelho";
    else if (umidBaixa) estado = "Umidade abaixo do limite → LED amarelo";
    else estado = "Condição adequada → LED verde";

    d3Msg.innerHTML = `Referências: T ≤ ${TEMP_MAX} °C · U ≥ ${UMID_MIN} %<br/><strong>${estado}</strong>`;

    if (d3Serial) {
      const linha = document.createElement("div");
      linha.textContent = `T=${t.toFixed(1)}C  U=${u.toFixed(
        1
      )}%  ESTADO=${tempAlta && umidBaixa ? "TEMP_ALTA+UMID_BAIXA" : tempAlta ? "TEMP_ALTA" : umidBaixa ? "UMID_BAIXA" : "OK"}`;
      d3Serial.appendChild(linha);
      while (d3Serial.children.length > 40) d3Serial.removeChild(d3Serial.children[1]);
      d3Serial.scrollTop = d3Serial.scrollHeight;
    }
  }
  [d3Temp, d3Umid].forEach((el) => el && el.addEventListener("input", atualizaD3));
  atualizaD3();
});
