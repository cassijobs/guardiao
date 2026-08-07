import { carregarRotas } from "./config.js";
import { UI, definirStatus } from "./ui.js";

let componenteRegistrado = false;
let cenaAtual = null;
let aoReconhecerAtual = null;
let rotasPorIndice = new Map();
let cancelado = false;
let temporizadorTroca = null;

function registrarComponente() {
  if (componenteRegistrado) return;

  AFRAME.registerComponent("guardiao-alvo", {
    schema: { indice: { type: "int" } },
    init() {
      this.el.addEventListener("targetFound", () => {
        const rota = rotasPorIndice.get(Number(this.data.indice));
        if (rota && aoReconhecerAtual) aoReconhecerAtual(rota);
      });
    }
  });

  componenteRegistrado = true;
}

async function montarCena(lote, rotas) {
  await pararCenaAtual();

  rotasPorIndice = new Map(
    rotas.map(rota => [Number(rota.targetIndex), rota])
  );

  UI.cena.innerHTML = `
    <a-scene
      mindar-image="imageTargetSrc:${lote.targets};autoStart:false;maxTrack:1;uiScanning:no;uiLoading:no;uiError:no;warmupTolerance:2;missTolerance:20"
      embedded
      vr-mode-ui="enabled:false"
      renderer="colorManagement:true;physicallyCorrectLights:true"
      device-orientation-permission-ui="enabled:false">
      <a-camera position="0 0 0" look-controls="enabled:false"></a-camera>
      ${rotas.map(rota => `
        <a-entity
          mindar-image-target="targetIndex:${Number(rota.targetIndex)}"
          guardiao-alvo="indice:${Number(rota.targetIndex)}">
        </a-entity>`).join("")}
    </a-scene>`;

  await customElements.whenDefined("a-scene");
  cenaAtual = UI.cena.querySelector("a-scene");

  await new Promise((resolve, reject) => {
    const limite = setTimeout(
      () => reject(new Error("A câmera demorou demais para iniciar.")),
      20000
    );

    const iniciar = async () => {
      try {
        const sistema = cenaAtual?.systems?.["mindar-image-system"];
        if (!sistema) return;
        clearTimeout(limite);
        await sistema.start();
        resolve();
      } catch (erro) {
        clearTimeout(limite);
        reject(erro);
      }
    };

    if (cenaAtual.hasLoaded) iniciar();
    else cenaAtual.addEventListener("loaded", iniciar, { once: true });
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
    // A câmera pode já ter sido encerrada pelo navegador.
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

export async function iniciarReconhecimento(
  lotesOuLote,
  aoReconhecer,
  codigoEsperado = ""
) {
  const lotes = Array.isArray(lotesOuLote)
    ? lotesOuLote
    : [lotesOuLote];

  if (!lotes.length) {
    throw new Error("Nenhum lote foi publicado no leitor.");
  }

  registrarComponente();
  aoReconhecerAtual = aoReconhecer;
  cancelado = false;

  const localizado = await localizarLoteDoArtefato(lotes, codigoEsperado);

  if (codigoEsperado && !localizado) {
    throw new Error("O artefato solicitado não está em nenhum lote publicado.");
  }

  if (localizado) {
    await montarCena(localizado.lote, localizado.rotas);
    definirStatus(
      `Procurando o símbolo — ${localizado.lote.nome}`,
      "procurando"
    );
    return localizado.rotas;
  }

  /*
   * Sem um código esperado, o leitor percorre os lotes publicados.
   * Isso mantém compatibilidade com lotes futuros sem limitar a leitura
   * ao primeiro arquivo .mind. Lotes mais recentes são testados primeiro.
   */
  const ordem = [...lotes].reverse();
  let indice = 0;

  const abrirProximo = async () => {
    if (cancelado) return;

    const lote = ordem[indice % ordem.length];
    const rotas = await carregarRotas(lote);
    await montarCena(lote, rotas);

    definirStatus(
      ordem.length > 1
        ? `Procurando símbolo — ${lote.nome} (${indice % ordem.length + 1}/${ordem.length})`
        : `Procurando símbolo — ${lote.nome}`,
      "procurando"
    );

    indice += 1;

    if (ordem.length > 1 && !cancelado) {
      temporizadorTroca = setTimeout(() => {
        abrirProximo().catch(erro => {
          console.error("Não foi possível alternar o lote do leitor:", erro);
        });
      }, 9000);
    }
  };

  await abrirProximo();
  return [];
}

export async function pararReconhecimento() {
  cancelado = true;
  aoReconhecerAtual = null;
  rotasPorIndice = new Map();
  await pararCenaAtual();
}
