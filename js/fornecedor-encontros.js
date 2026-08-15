/* O conteúdo das jornadas existe somente no Supabase. Não há cópia local. */
const FornecedorEncontros = {
    async buscar(_indice, codigoArtefato) {
        if (!window.GuardiaoAPI?.buscarEncontroAtual) {
            throw new Error("O acesso protegido aos encontros não foi carregado.");
        }
        const encontro = await window.GuardiaoAPI.buscarEncontroAtual(codigoArtefato);
        if (!encontro) return null;
        if (!Array.isArray(encontro.roteiro)) {
            throw new Error("O encontro recebido não possui um roteiro válido.");
        }
        return { ...encontro, cenas: encontro.roteiro };
    }
};

window.FornecedorEncontros = FornecedorEncontros;
