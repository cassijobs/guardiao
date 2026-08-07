/* Guardião v5.1.5 — proteção administrativa robusta via Supabase Auth. */
(() => {
    const LOGIN_PAGE = 'admin-login.html';
    const TEMPO_LIMITE_MS = 12000;

    function destinoAtual() {
        const nome = location.pathname.split('/').pop() || 'admin-artefatos.html';
        return encodeURIComponent(nome + location.search + location.hash);
    }

    function comTempoLimite(promessa, ms = TEMPO_LIMITE_MS) {
        return Promise.race([
            promessa,
            new Promise((_, rejeitar) => setTimeout(
                () => rejeitar(new Error('A verificação de acesso demorou mais que o esperado.')), ms
            ))
        ]);
    }

    async function verificarAcesso() {
        const cliente = window.GuardiaoSupabase || window.supabaseClient;
        if (!cliente) {
            throw new Error(window.GuardiaoSupabaseErro || 'Cliente Supabase não carregado. Atualize a página com Ctrl + F5.');
        }

        const resultadoSessao = await comTempoLimite(cliente.auth.getSession());
        const session = resultadoSessao?.data?.session;
        if (resultadoSessao?.error || !session) {
            location.replace(`${LOGIN_PAGE}?destino=${destinoAtual()}`);
            return null;
        }

        const resultadoAdmin = await comTempoLimite(cliente.rpc('verificar_admin_guardiao'));
        const data = resultadoAdmin?.data;
        const autorizado = data === true || data?.autorizado === true;

        if (resultadoAdmin?.error || !autorizado) {
            await cliente.auth.signOut();
            location.replace(`${LOGIN_PAGE}?negado=1`);
            return null;
        }

        return { session, admin: data };
    }

    async function sair() {
        const cliente = window.GuardiaoSupabase || window.supabaseClient;
        if (cliente) await cliente.auth.signOut();
        location.replace(LOGIN_PAGE);
    }

    window.GuardiaoAdmin = { verificarAcesso, sair };
})();
