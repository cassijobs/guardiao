import { carregarConfiguracao } from "./config.js";
import {
  UI,
  mostrarInicial,
  mostrarLeitor,
  definirStatus,
  mostrarErro
} from "./ui.js";
import {
  iniciarReconhecimento,
  pararReconhecimento
} from "./reconhecimento.js";
import { executarRitual } from "./ritual.js";

const PARAMETROS = new URLSearchParams(window.location.search);
const MODO = String(PARAMETROS.get("modo") || "").toLowerCase();
const MODO_RECUPERACAO = MODO === "recuperacao";
const ARTEFATO_ESPERADO = normalizar(PARAMETROS.get("artefato"));

let iniciou = false;
let reconhecendo = false;

function normalizar(valor) {
  return String(valor || "").trim().toUpperCase();
}

function obterBasePublica() {
  const url = new URL(window.location.href);
  const partes = url.pathname.split("/").filter(Boolean);

  if (partes.at(-1)?.toLowerCase() === "ar") {
    partes.pop();
  }

  return `${url.origin}/${partes.join("/")}${partes.length ? "/" : ""}`;
}

function salvarComprovanteDaLeitura(codigo) {
  const registro = JSON.stringify({
    codigo,
    confirmado: true,
    instante: Date.now(),
    origem: "leitor-unico",
    versao: "6.1"
  });

  try {
    sessionStorage.setItem("guardiao_ultima_leitura_confirmada", registro);
  } catch (_) {
    // O retorno pela URL continua suficiente.
  }

  try {
    localStorage.setItem("guardiao_ultima_leitura_confirmada", registro);
    localStorage.setItem("guardiao_artefato_codigo", codigo);
  } catch (_) {
    // O retorno pela URL continua suficiente.
  }
}

function prepararTextoInicial() {
  const nota = document.getElementById("notaInicial");

  if (MODO_RECUPERACAO) {
    UI.mensagemInicial.textContent =
      "Aproxime o símbolo guardado para reencontrar o caminho do seu Guardião.";
    UI.iniciar.textContent = "RECUPERAR O GUARDIÃO";
    if (nota) nota.textContent =
      "A câmera será aberta somente depois que você tocar no botão.";
    return;
  }

  UI.mensagemInicial.innerHTML =
    "<strong>Antes do primeiro encontro, há algo que precisa ser encontrado.</strong><br><br>" +
    "O símbolo que acompanha este artefato permitirá que a caminhada comece.";
  UI.iniciar.textContent = "ENCONTRAR O SÍMBOLO";
  if (nota) nota.textContent =
    "A câmera será aberta somente depois que você tocar no botão.";
}

async function artefatoReconhecido(rota) {
  if (reconhecendo) return;
  reconhecendo = true;

  const codigo = normalizar(rota?.codigo);
  if (!codigo) {
    reconhecendo = false;
    mostrarErro("O símbolo foi localizado, mas não possui um código válido.");
    return;
  }

  document.body.classList.add("reconhecido");
  definirStatus("Artefato reconhecido", "reconhecido");

  try {
    await pararReconhecimento();
    await executarRitual(rota, {
      modoAtivacao: false,
      modoRecuperacao: MODO_RECUPERACAO
    });

    salvarComprovanteDaLeitura(codigo);

    // O leitor é o único ponto de reconhecimento. A jornada recebe o
    // código já confirmado e jamais deve solicitar outra câmera.
    const destino = new URL(obterBasePublica());
    destino.searchParams.set("artefato", codigo);
    destino.searchParams.set("leitura", "confirmada");
    destino.searchParams.set("origem", "leitor-unico");
    destino.searchParams.set("v", "610");
    destino.hash = "simbolo-reconhecido";

    window.location.replace(destino.toString());
  } catch (erro) {
    reconhecendo = false;
    document.body.classList.remove("reconhecido");
    mostrarErro(erro?.message || "Não foi possível abrir o Guardião.");
  }
}

async function iniciar() {
  if (iniciou) return;
  iniciou = true;
  UI.iniciar.disabled = true;

  try {
    const config = await carregarConfiguracao();
    mostrarLeitor();
    definirStatus("Solicitando acesso à câmera…", "preparando");

    await iniciarReconhecimento(
      config.lotes,
      artefatoReconhecido,
      ARTEFATO_ESPERADO
    );

    definirStatus(
      ARTEFATO_ESPERADO
        ? "Procurando o símbolo deste artefato…"
        : "Aponte a câmera para o símbolo do artefato…",
      "procurando"
    );
  } catch (erro) {
    iniciou = false;
    UI.iniciar.disabled = false;

    const mensagem = erro?.name === "NotAllowedError"
      ? "A permissão da câmera foi negada. Libere-a nas configurações e tente novamente."
      : (erro?.message || "Não foi possível iniciar o leitor.");

    mostrarInicial(mensagem);
  }
}

prepararTextoInicial();
UI.iniciar.addEventListener("click", iniciar);
window.addEventListener("pagehide", pararReconhecimento);
