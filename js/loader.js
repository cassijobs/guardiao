/*
======================================================
GUARDIÃO — CARREGADOR AUTOMÁTICO
======================================================

Este arquivo carrega todos os módulos na ordem correta.

A versão é criada automaticamente com Date.now().
Portanto, não é necessário alterar números manualmente.

IMPORTANTE:
Quando uma nova jornada for criada, acrescente o caminho
dela na lista ARQUIVOS, antes de js/condutor.js.
======================================================
*/

(function carregarGuardiao() {

    const versaoAutomatica = Date.now();

    /*
     * A ordem abaixo é obrigatória.
     *
     * 1. Configurações e memória
     * 2. Interface
     * 3. Jornadas
     * 4. Sistema principal
     * 5. Inicialização
     */
    const ARQUIVOS = [

        "js/config.js",
        "js/memoria.js",
        "js/supabase.js",
        "js/api.js",
        "js/fornecedor-encontros.js",
        "js/palco.js",
        "js/supabase.js",

        "jornadas/j1_aprender_a_olhar.js",
        "jornadas/j2_caminhar_ao_lado.js",

        "js/condutor.js",
        "js/agenda.js",
        "js/dev.js",
        "js/script.js"

    ];

    /*
     * Como o loader é executado durante a leitura do HTML,
     * document.write mantém o carregamento sincronizado.
     *
     * Isso preserva a ordem dos módulos e garante que
     * DOMContentLoaded aconteça somente depois de todos
     * os arquivos estarem disponíveis.
     */
    for (const arquivo of ARQUIVOS) {

        document.write(
            '<script src="' +
            arquivo +
            '?v=' +
            versaoAutomatica +
            '"><\/script>'
        );

    }

})();
