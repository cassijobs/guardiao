import { carregarRotas } from "./config.js";
import { UI, definirStatus } from "./ui.js";

let cenaAtual = null;
let aoReconhecerAtual = null;
let cancelado = false;
let temporizadorTroca = null;
let alvoReconhecido = false;

function urlSemCache(caminho) {
  const url = new URL(caminho, window.location.href);
  url.searchParams.set("guardiao", `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  return url.toString();
}

function registrarEventosDosAlvos(cena, rotas) {
  for (const rota of rotas) {
    const indice = Number(rota.targetIndex);
    const entidade = cena.querySelector(`[data-guardiao-indice="${indice}"]`);
    if (!entidade) continue;

    entidade.addEventListener("targetFound", () => {
      if (cancelado || alvoReconhecido || !aoReconhecerAtual) return;
      alvoReconhecido = true;
      definirStatus(`Símbolo reconhecido: ${rota.codigo}`, "reconhecido");
      aoReconhecerAtual(rota);
    });

    entidade.addEventListener("targetLost", () => {
      if (!alvoReconhecido) {
        definirStatus("Símbolo perdido. Reposicione-o dentro da moldura.", "procurando");
      }
    });
  }
}

async function montarCena(lote, rotas) {
  await pararCenaAtual();
  alvoReconhecido = false;

  const alvoMind = urlSemCache(lote.targets);
  definirStatus("Preparando o leitor…", "preparando");

  UI.cena.innerHTML = `
    <a-scene
      mindar-image="imageTargetSrc: ${alvoMind}; autoStart: false; maxTrack: 1; uiScanning: no; uiLoading: no; uiError: no; warmupTolerance: 3; missTolerance: 25; filterMinCF: 0.0001; filterBeta: 0.001"
      embedded
      vr-mode-ui="enabled: false"
      renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true"
      device-orientation-permission-ui="enabled: false">
      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
      ${rotas.map(rota => `
        <a-entity
          data-guardiao-indice="${Number(rota.targetIndex)}"
          mindar-image-target="targetIndex: ${Number(rota.targetIndex)}">
        </a-entity>`).join("")}
    </a-scene>`;

  await customElements.whenDefined("a-scene");
  cenaAtual = UI.cena.querySelector("a-scene");
  if (!cenaAtual) throw new Error("A cena do leitor não foi criada.");

  registrarEventosDosAlvos(cenaAtual, rotas);

  await new Promise((resolve, reject) => {
    const limite = setTimeout(
      () => reject(new Error("O leitor demorou demais para ficar pronto.")),
      30000
    );

    let iniciado = false;

    const iniciarSistema = async () => {
      if (iniciado || cancelado) return;
      const sistema = cenaAtual?.systems?.["mindar-image-system"];
      if (!sistema) return;
      iniciado = true;

      try {
        definirStatus("Preparando a câmera…", "preparando");
        await sistema.start();
        clearTimeout(limite);
        definirStatus("Leitor pronto. Aponte para o símbolo.", "procurando");
        resolve();
      } catch (erro) {
        clearTimeout(limite);
        reject(new Error("Não foi possível iniciar o leitor."));
      }
    };

    cenaAtual.addEventListener("arReady", () => {
      definirStatus("Leitor pronto. Aponte para o símbolo.", "procurando");
    });

    cenaAtual.addEventListener("arError", event => {
      clearTimeout(limite);
      reject(new Error("Não foi possível carregar os dados de reconhecimento."));
    }, { once: true });

    if (cenaAtual.hasLoaded) iniciarSistema();
    else cenaAtual.addEventListener("loaded", iniciarSistema, { once: true });
  });
}

async function pararCenaAtual() {
  if (temporizadorTroca) {
    clearTimeout(temporizadorTroca);
    temporizadorTroca = null;
  }

  try {
    const sistema = cenaAtual?.systems?.["mindar-image-system"];
    if (sistema) await sistema.stop();
  } catch (_) {
    // A câmera pode já ter sido encerrada.
  }

  cenaAtual = null;
  UI.cena.innerHTML = "";
}

async function localizarLoteDoArtefato(lotes, codigoEsperado) {
  const esperado = String(codigoEsperado || "").trim().toUpperCase();
  if (!esperado) return null;

  for (const lote of lotes) {
    const rotas = await carregarRotas(lote);
    const encontrou = rotas.some(
      rota => String(rota.codigo || "").trim().toUpperCase() === esperado
    );
    if (encontrou) return { lote, rotas };
  }
  return null;
}

export async function iniciarReconhecimento(lotesOuLote, aoReconhecer, codigoEsperado = "") {
  const lotes = Array.isArray(lotesOuLote) ? lotesOuLote : [lotesOuLote];
  if (!lotes.length) throw new Error("Nenhum lote foi publicado no leitor.");

  aoReconhecerAtual = aoReconhecer;
  cancelado = false;
  alvoReconhecido = false;

  const localizado = await localizarLoteDoArtefato(lotes, codigoEsperado);
  if (codigoEsperado && !localizado) {
    throw new Error("O artefato solicitado não está em nenhum lote publicado.");
  }

  if (localizado) {
    await montarCena(localizado.lote, localizado.rotas);
    return localizado.rotas;
  }

  const ordem = [...lotes].reverse();
  let indice = 0;

  const abrirProximo = async () => {
    if (cancelado || alvoReconhecido) return;
    const lote = ordem[indice % ordem.length];
    const rotas = await carregarRotas(lote);
    await montarCena(lote, rotas);
    indice += 1;

    if (ordem.length > 1 && !cancelado && !alvoReconhecido) {
      temporizadorTroca = setTimeout(() => {
        abrirProximo().catch(erro => console.error("Falha ao alternar lote:", erro));
      }, 12000);
    }
  };

  await abrirProximo();
  return [];
}

export async function pararReconhecimento() {
  cancelado = true;
  aoReconhecerAtual = null;
  alvoReconhecido = false;
  await pararCenaAtual();
}
