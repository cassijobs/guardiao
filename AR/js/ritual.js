import { UI } from "./ui.js";
import { identidadeDaRota } from "./identidade.js";

const TEMPO_REVELACAO = 900;
const TEMPO_LEITURA = 3200;
const TEMPO_FADE_SAIDA = 900;

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function animarSaida() {
  if (typeof UI.ritual.animate !== "function") {
    UI.ritual.style.opacity = "0";
    return esperar(TEMPO_FADE_SAIDA);
  }

  const animacao = UI.ritual.animate(
    [
      { opacity: 1 },
      { opacity: 0 }
    ],
    {
      duration: TEMPO_FADE_SAIDA,
      easing: "ease-in-out",
      fill: "forwards"
    }
  );

  return animacao.finished.catch(() => undefined);
}

export async function executarRitual(
  rota,
  opcoes = {}
) {
  const identidade = identidadeDaRota(rota);
  const modoAtivacao = opcoes.modoAtivacao === true;
  const modoRecuperacao = opcoes.modoRecuperacao === true;

  UI.ritual.style.opacity = "";
  UI.ritualSelo.src = rota.imagem || "";

  UI.ritualEstado.textContent = modoRecuperacao
    ? "CHAVE DE RECUPERAÇÃO RECONHECIDA"
    : modoAtivacao
      ? "SÍMBOLO RECONHECIDO"
      : "ARTEFATO RECONHECIDO";

  UI.ritualCodigo.textContent = rota.codigo || "ARTEFATO";

  UI.ritualMensagem.textContent = modoRecuperacao
    ? "O caminho foi reencontrado."
    : "A jornada está pronta.";

  UI.ritualIdentidade.innerHTML = `
    <span>Casa</span><strong>${identidade.casa}</strong>
    <span>Essência</span><strong>${identidade.essencia}</strong>
  `;
  UI.ritualIdentidade.classList.add("oculto");

  UI.ritual.classList.remove("oculto");
  UI.ritual.classList.remove("executando");
  void UI.ritual.offsetWidth;
  UI.ritual.classList.add("executando");

  if (navigator.vibrate) {
    navigator.vibrate(
      modoRecuperacao
        ? [45, 30, 65, 30, 100]
        : [55, 35, 90]
    );
  }

  await esperar(TEMPO_REVELACAO);
  UI.ritualIdentidade.classList.remove("oculto");
  await esperar(TEMPO_LEITURA);
  await animarSaida();
}

export function limparRitual() {
  UI.ritual.classList.remove("executando");
  UI.ritual.classList.add("oculto");
  UI.ritual.style.opacity = "";
  UI.ritualSelo.removeAttribute("src");
}
