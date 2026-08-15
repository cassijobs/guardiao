/*
======================================================
GUARDIÃO — CARREGADOR MESTRE 6.0
======================================================
A leitura do símbolo acontece somente no leitor AR.
Ao chegar à jornada com ?artefato=MKS-XXXXX, o Guardião
reconhece a identidade e abre o encontro diretamente.
======================================================
*/
(async function carregarGuardiao() {
  const versaoAutomatica = Date.now();

  function carregarScript(caminho) {
    return new Promise((resolver, rejeitar) => {
      const script = document.createElement("script");
      script.src = `${caminho}?v=${versaoAutomatica}`;
      script.async = false;
      script.onload = resolver;
      script.onerror = () => rejeitar(new Error(`Não foi possível carregar ${caminho}.`));
      document.head.appendChild(script);
    });
  }

  try {
    const arquivos = [
      "js/config.js",
      "js/memoria.js",
      "js/supabase.js",
      "js/artefato.js",
      "js/api.js",
      "js/fornecedor-encontros.js",
      "js/palco.js",
      "js/saudacao.js",
      "js/condutor.js",
      "js/agenda.js",
      "js/script.js"
    ];

    for (const arquivo of arquivos) await carregarScript(arquivo);
  } catch (erro) {
    console.error("Erro ao carregar o Guardião:", erro);
    const area = document.getElementById("guardiao") || document.getElementById("app") || document.body;
    area.innerHTML = `<section class="tela-espera"><p class="fala-guardiao">Não foi possível abrir o Guardião.</p><p class="fala-guardiao fala-secundaria">Atualize a página e tente novamente.</p></section>`;
  }
})();
