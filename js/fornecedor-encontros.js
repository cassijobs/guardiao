/*
======================================================
GUARDIÃO — FORNECEDOR DE ENCONTROS
======================================================

Este módulo decide de onde vem o encontro:

1. tenta buscar no Supabase;
2. se não encontrar, usa as jornadas locais.

Assim, o restante do Guardião não precisa saber
onde o encontro está armazenado.
======================================================
*/

const FornecedorEncontros = {

    async buscar(indice, encontrosLocais = []) {

        const numeroEncontro =
            indice + 1;

        try {

            if (
                typeof GuardiaoAPI !== "undefined" &&
                GuardiaoAPI.buscarEncontroPorNumero
            ) {

                const encontroSupabase =
                    await GuardiaoAPI
                        .buscarEncontroPorNumero(
                            numeroEncontro
                        );

                if (
                    encontroSupabase &&
                    Array.isArray(
                        encontroSupabase.roteiro
                    )
                ) {

                    console.log(
                        `Encontro ${numeroEncontro} carregado do Supabase.`
                    );

                    return {
                        ...encontroSupabase,
                        cenas:
                            encontroSupabase.roteiro
                    };

                }

            }

        } catch (erro) {

            console.warn(
                "Falha ao buscar encontro no Supabase. Usando versão local.",
                erro
            );

        }

        const encontroLocal =
            encontrosLocais[indice];

        if (encontroLocal) {

            console.log(
                `Encontro ${numeroEncontro} carregado localmente.`
            );

            return encontroLocal;

        }

        return null;

    }

};

window.FornecedorEncontros =
    FornecedorEncontros;

console.log(
    "Fornecedor de encontros preparado."
);
