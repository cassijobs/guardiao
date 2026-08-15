/* GUARDIÃO — acesso protegido aos encontros no Supabase. */
const GuardiaoAPI = {
    async buscarEncontroAtual(codigo) {
        const valor = String(codigo || "").trim().toUpperCase();
        if (!valor) throw new Error("O Artefato não foi informado.");

        const { data, error } = await supabaseClient.rpc(
            "buscar_encontro_guardiao",
            { p_codigo: valor }
        );

        if (error) {
            console.error("Erro ao buscar encontro protegido:", error);
            throw new Error(error.message || "Não foi possível buscar o encontro.");
        }

        const resposta = Array.isArray(data) ? data[0] : data;
        if (!resposta?.ok) throw new Error(resposta?.motivo || "Encontro indisponível.");
        return resposta.concluida ? null : resposta.encontro;
    }
};

window.GuardiaoAPI = GuardiaoAPI;
