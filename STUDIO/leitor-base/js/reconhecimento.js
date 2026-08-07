import { carregarRotas } from "./config.js";
import { UI, definirStatus } from "./ui.js";

let componenteRegistrado = false;
let cenaAtual = null;

function registrarComponente(aoReconhecer) {
  if (componenteRegistrado) return;
  AFRAME.registerComponent("guardiao-alvo", {
    schema: { indice: { type: "int" } },
    init() {
      this.el.addEventListener("targetFound", () => aoReconhecer(this.data.indice));
    }
  });
  componenteRegistrado = true;
}

export async function iniciarReconhecimento(lote, aoReconhecer) {
  const rotas = await carregarRotas(lote);
  const porIndice = new Map(rotas.map(rota => [Number(rota.targetIndex), rota]));

  registrarComponente(indice => {
    const rota = porIndice.get(Number(indice));
    if (rota) aoReconhecer(rota);
  });

  UI.cena.innerHTML = `
    <a-scene
      mindar-image="imageTargetSrc:${lote.targets};autoStart:false;maxTrack:1;uiScanning:no;uiLoading:no;uiError:no;warmupTolerance:2;missTolerance:20"
      embedded
      vr-mode-ui="enabled:false"
      renderer="colorManagement:true;physicallyCorrectLights:true"
      device-orientation-permission-ui="enabled:false">
      <a-camera position="0 0 0" look-controls="enabled:false"></a-camera>
      ${rotas.map(rota => `<a-entity mindar-image-target="targetIndex:${Number(rota.targetIndex)}" guardiao-alvo="indice:${Number(rota.targetIndex)}"></a-entity>`).join("")}
    </a-scene>`;

  await customElements.whenDefined("a-scene");
  cenaAtual = UI.cena.querySelector("a-scene");

  await new Promise((resolve, reject) => {
    const limite = setTimeout(() => reject(new Error("A câmera demorou demais para iniciar.")), 15000);
    const iniciar = async () => {
      try {
        const sistema = cenaAtual.systems?.["mindar-image-system"];
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

  definirStatus(`Procurando símbolo — ${lote.nome}`, "procurando");
  return rotas;
}

export async function pararReconhecimento() {
  try {
    const sistema = cenaAtual?.systems?.["mindar-image-system"];
    if (sistema) await sistema.stop();
  } catch (_) {
    // A câmera pode já ter sido encerrada pelo navegador.
  }
}
