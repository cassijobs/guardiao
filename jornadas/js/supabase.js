/*
    GUARDIÃO — CONEXÃO ÚNICA COM O SUPABASE
    v5.1.5

    Este arquivo cria uma única conexão global para todas as páginas.
    Nunca coloque aqui uma Secret Key.
*/
(function prepararSupabaseGuardiao() {
    const SUPABASE_URL = "https://wpnrujzxqxztlqtmkwfw.supabase.co";
    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_GJ0P5fcqW_-a-qO_TQKIBQ_swfsLe-B";

    if (!window.supabase || typeof window.supabase.createClient !== "function") {
        console.error("A biblioteca do Supabase não foi carregada pelo CDN.");
        window.GuardiaoSupabaseErro =
            "A biblioteca do Supabase não foi carregada. Verifique a internet e atualize a página.";
        return;
    }

    try {
        const cliente = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

        // Nomes globais mantidos para compatibilidade com todas as versões.
        window.supabaseClient = cliente;
        window.GuardiaoSupabase = cliente;
        window.GuardiaoSupabaseErro = "";
        console.log("Cliente Supabase preparado.");
    } catch (erro) {
        console.error("Falha ao preparar o cliente Supabase:", erro);
        window.GuardiaoSupabaseErro =
            erro?.message || "Não foi possível preparar a conexão com o Supabase.";
    }
})();
