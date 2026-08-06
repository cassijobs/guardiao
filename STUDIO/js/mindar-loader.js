/*
======================================================
GUARDIÃO STUDIO — CARREGADOR RESILIENTE DO MINDAR
Tenta mais de uma origem e aceita os namespaces
conhecidos do compilador MindAR.
======================================================
*/
(() => {
  "use strict";

  const ORIGENS = [
    "https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/dist/mindar-image.prod.js",
    "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image.prod.js",
    "https://unpkg.com/mind-ar@1.2.5/dist/mindar-image.prod.js"
  ];

  const obterCompilerAtual = () =>
    window.MINDAR?.Compiler ||
    window.MINDAR?.IMAGE?.Compiler ||
    window.MINDAR_IMAGE?.Compiler ||
    null;

  function carregarScript(url) {
    return new Promise((resolve, reject) => {
      const seletor = `script[data-guardiao-mindar="${CSS.escape(url)}"]`;
      const existente = document.querySelector(seletor);

      if (existente) {
        if (existente.dataset.carregado === "sim") {
          resolve();
          return;
        }
        existente.addEventListener("load", resolve, { once: true });
        existente.addEventListener("error", () => reject(new Error(`Falha ao carregar ${url}`)), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.guardiaoMindar = url;

      const limite = setTimeout(() => {
        script.remove();
        reject(new Error(`Tempo esgotado ao carregar ${url}`));
      }, 20000);

      script.onload = () => {
        clearTimeout(limite);
        script.dataset.carregado = "sim";
        resolve();
      };

      script.onerror = () => {
        clearTimeout(limite);
        script.remove();
        reject(new Error(`Falha ao carregar ${url}`));
      };

      document.head.appendChild(script);
    });
  }

  let tentativaAtual = null;

  async function garantirCompiler() {
    const existente = obterCompilerAtual();
    if (existente) return existente;

    if (tentativaAtual) return tentativaAtual;

    tentativaAtual = (async () => {
      const erros = [];

      for (const url of ORIGENS) {
        try {
          await carregarScript(url);
          await new Promise(resolve => setTimeout(resolve, 50));

          const Compiler = obterCompilerAtual();
          if (Compiler) return Compiler;

          erros.push(`${url}: carregou, mas não expôs o compilador`);
        } catch (erro) {
          erros.push(`${url}: ${erro.message}`);
        }
      }

      throw new Error(
        "O compilador MindAR não pôde ser carregado por nenhuma das três origens disponíveis. " +
        "Confira a conexão, desative temporariamente bloqueadores de conteúdo para esta página e recarregue o Studio."
      );
    })();

    try {
      return await tentativaAtual;
    } finally {
      if (!obterCompilerAtual()) tentativaAtual = null;
    }
  }

  window.GuardiaoMindAR = Object.freeze({
    garantirCompiler,
    obterCompilerAtual,
    origens: [...ORIGENS]
  });

  // Começa a carregar antes de o usuário chegar à etapa de publicação.
  garantirCompiler().catch(() => {});
})();
