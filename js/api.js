/*
======================================================
GUARDIÃO — CAMADA DE ACESSO AOS DADOS
======================================================

Este arquivo concentra as consultas ao Supabase.

O restante do Guardião não precisa conhecer os detalhes
do banco. Ele apenas chama funções como:

GuardiaoAPI.buscarEncontroPorNumero(1);
======================================================
*/

const GuardiaoAPI = {

    /*
     * Busca um encontro pelo número.
     *
     * O jornadaId é opcional por enquanto.
     * Mais adiante, ele será usado para distinguir
     * encontros de jornadas diferentes.
     */
    async buscarEncontroPorNumero(numero, jornadaId = null) {

        if (!Number.isInteger(numero) || numero < 1) {
            throw new Error("O número do encontro é inválido.");
        }

        let consulta = supabaseClient
            .from("encontros")
            .select(
                "id, jornada_id, numero, titulo, roteiro, versao, status"
            )
            .eq("numero", numero);

        if (jornadaId) {
            consulta = consulta.eq("jornada_id", jornadaId);
        }

        const { data, error } = await consulta.limit(1);

        if (error) {
            console.error(
                "Erro ao buscar encontro no Supabase:",
                error
            );

            throw new Error(
                error.message || "Não foi possível buscar o encontro."
            );
        }

        if (!data || data.length === 0) {
            return null;
        }

        return data[0];
    },


    /*
     * Lista os encontros cadastrados.
     *
     * Esta função será útil futuramente no painel
     * administrativo e durante os testes.
     */
    async listarEncontros() {

        const { data, error } = await supabaseClient
            .from("encontros")
            .select(
                "id, jornada_id, numero, titulo, versao, status"
            )
            .order("numero", { ascending: true });

        if (error) {
            console.error(
                "Erro ao listar encontros:",
                error
            );

            throw new Error(
                error.message || "Não foi possível listar os encontros."
            );
        }

        return data || [];
    }

};


/*
 * Disponibiliza a API para os outros módulos
 * do Guardião.
 */
window.GuardiaoAPI = GuardiaoAPI;

console.log("GuardiaoAPI preparada.");
