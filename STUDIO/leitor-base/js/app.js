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
const MODO_ATIVACAO = MODO === "ativacao";
const MODO_RECUPERACAO = MODO === "recuperacao";
const ARTEFATO_ESPERADO = normalizar(PARAMETROS.get("artefato"));
const RETORNO = obterRetornoSeguro(PARAMETROS.get("retorno"));

let config = null;
let iniciou = false;
let reconhecendo = false;

function normalizar(valor) {
  return String(valor || "").trim().toUpperCase();
}

function obterRetornoSeguro(valor) {
  if (!valor) return null;

  try {
    const url = new URL(valor, window.location.href);
    return url.origin === window.location.origin
      ? url.toString()
      : null;
  } catch (_) {
    return null;
  }
}

function chaveDeAtivacao(codigo) {
  return `guardiao_ativado_${normalizar(codigo)}`;
}

function registrarAtivacao(codigo, origem) {
  const normalizado = normalizar(codigo);
  const agora = new Date().toISOString();
  const registro = {
    ativado: true,
    codigo: normalizado,
    origem,
    ativadoEm: agora,
    versao: 2
  };

  if (origem === "recuperacao") {
    registro.recuperadoEm = agora;
  }

  localStorage.setItem(
    chaveDeAtivacao(normalizado),
    JSON.stringify(registro)
  );

  try {
    sessionStorage.removeItem("guardiao_ativacao_pendente");
  } catch (_) {
    // Não impede a conclusão da ativação ou recuperação.
  }
}

function prepararTextoInicial() {
  const nota = document.getElementById("notaInicial");

  if (MODO_ATIVACAO) {
    UI.mensagemInicial.textContent =
      "Encontre o símbolo que acompanha este artefato.";
    UI.iniciar.textContent = "RECONHECER O SÍMBOLO";

    if (nota) {
      nota.textContent =
        "A câmera será usada somente para confirmar a primeira ativação.";
    }
    return;
  }

  if (MODO_RECUPERACAO) {
    UI.mensagemInicial.textContent =
      "Aproxime o símbolo guardado para reencontrar o caminho do seu Guardião.";
    UI.iniciar.textContent = "RECUPERAR O GUARDIÃO";

    if (nota) {
      nota.textContent =
        "O símbolo restaurará o acesso deste artefato neste aparelho.";
    }
  }
}

function removerControlesDeLote() {
  const seletores = [
    "#trocarLote", "#seletorLote", "#listaLotes",
    "[data-lote]", "[data-action=\"trocar-lote\"]",
    ".trocar-lote", ".seletor-lote", ".controle-lote", ".admin-lote"
  ];

  document
    .querySelectorAll(seletores.join(","))
    .forEach(elemento => elemento.remove());

  document.querySelectorAll("button, a").forEach(elemento => {
    const texto = (elemento.textContent || "")
      .trim()
      .toLowerCase();

    if (
      texto.includes("trocar lote") ||
      texto.includes("selecionar lote")
    ) {
      elemento.remove();
    }
  });
}

function lotePublicado() {
  if (!config?.lotes?.length) {
    throw new Error("Nenhum lote de símbolos foi publicado.");
  }

  return config.lotes[0];
}

function destinoRecuperado(rota) {
  if (!rota?.destino) return null;

  try {
    const destino = new URL(rota.destino, window.location.href);

    if (!destino.searchParams.has("artefato") && rota.codigo) {
      destino.searchParams.set("artefato", normalizar(rota.codigo));
    }

    return destino.toString();
  } catch (_) {
    return rota.destino;
  }
}

async function artefatoReconhecido(rota) {
  if (reconhecendo) return;

  if (
    MODO_ATIVACAO &&
    normalizar(rota.codigo) !== ARTEFATO_ESPERADO
  ) {
    definirStatus(
      "Este não é o símbolo deste artefato.",
      "incorreto"
    );
    mostrarErro(
      "Procure o símbolo que acompanha o artefato apresentado ao Guardião.",
      4200
    );
    return;
  }

  reconhecendo = true;
  document.body.classList.add("reconhecido");
  definirStatus(
    MODO_RECUPERACAO
      ? "Chave de recuperação reconhecida"
      : MODO_ATIVACAO
        ? "Símbolo reconhecido"
        : "Artefato reconhecido",
    "reconhecido"
  );

  try {
    await pararReconhecimento();

    await executarRitual(rota, {
      modoAtivacao: MODO_ATIVACAO,
      modoRecuperacao: MODO_RECUPERACAO
    });

    if (MODO_ATIVACAO) {
      registrarAtivacao(rota.codigo, "primeira-ativacao");

      const destino = RETORNO || rota.destino;

      if (!destino) {
        throw new Error("Não foi possível retornar ao Guardião.");
      }

      window.location.replace(destino);
      return;
    }

    if (MODO_RECUPERACAO) {
      registrarAtivacao(rota.codigo, "recuperacao");

      const destino = destinoRecuperado(rota);

      if (!destino) {
        throw new Error(
          "O símbolo foi reconhecido, mas o caminho deste artefato não foi encontrado."
        );
      }

      window.location.replace(destino);
      return;
    }

    if (!rota.destino) {
      throw new Error(
        "Este artefato não possui um destino configurado."
      );
    }

    window.location.assign(rota.destino);

  } catch (erro) {
    reconhecendo = false;
    document.body.classList.remove("reconhecido");
    mostrarErro(
      erro.message ||
      "Não foi possível abrir o Guardião."
    );
  }
}

async function iniciar() {
  if (iniciou) return;

  if (MODO_ATIVACAO && !ARTEFATO_ESPERADO) {
    mostrarInicial(
      "A chave do artefato não foi encontrada. Aproxime novamente o NFC."
    );
    return;
  }

  iniciou = true;
  UI.iniciar.disabled = true;

  try {
    config = await carregarConfiguracao();
    mostrarLeitor();
    definirStatus(
      "Solicitando acesso à câmera…",
      "preparando"
    );

    await iniciarReconhecimento(
      lotePublicado(),
      artefatoReconhecido
    );

    if (MODO_ATIVACAO) {
      definirStatus(
        "Procurando o símbolo deste artefato…",
        "procurando"
      );
    } else if (MODO_RECUPERACAO) {
      definirStatus(
        "Procurando sua chave de recuperação…",
        "procurando"
      );
    }

  } catch (erro) {
    iniciou = false;

    const mensagem =
      erro?.name === "NotAllowedError"
        ? "A permissão da câmera foi negada. Libere-a nas configurações do navegador e tente novamente."
        : (
            erro.message ||
            "Não foi possível iniciar o leitor."
          );

    mostrarInicial(mensagem);
  }
}

prepararTextoInicial();
removerControlesDeLote();

new MutationObserver(removerControlesDeLote)
  .observe(
    document.documentElement,
    { childList: true, subtree: true }
  );

UI.iniciar.addEventListener("click", iniciar);
window.addEventListener("pagehide", pararReconhecimento);
