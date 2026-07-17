/*
======================================================
GUARDIÃO v4.0
INICIALIZAÇÃO DE TODAS AS JORNADAS
======================================================
Une automaticamente as jornadas carregadas pelo loader.

Encontro 1  = JORNADA1[0]
Encontro 15 = JORNADA1[14]
Encontro 16 = primeiro encontro da JORNADA2
======================================================
*/

const app =
    document.getElementById("guardiao") ||
    document.getElementById("app");

function obterTodosOsEncontros() {

    const jornadas = [];

    if (
        typeof JORNADA1 !== "undefined" &&
        Array.isArray(JORNADA1)
    ) {
        jornadas.push(JORNADA1);
    }

    if (
        typeof JORNADA2 !== "undefined" &&
        Array.isArray(JORNADA2)
    ) {
        jornadas.push(JORNADA2);
    }

    if (
        typeof JORNADA3 !== "undefined" &&
        Array.isArray(JORNADA3)
    ) {
        jornadas.push(JORNADA3);
    }

    if (
        typeof JORNADA4 !== "undefined" &&
        Array.isArray(JORNADA4)
    ) {
        jornadas.push(JORNADA4);
    }

    return jornadas.flat();

}

async function iniciarGuardiao() {

    try {

        if (!app) {
            throw new Error(
                "Não foi encontrado o elemento #guardiao nem #app."
            );
        }

        AgendaGuardiao.pararRelogio();

        const encontros =
            obterTodosOsEncontros();

        const total =
            encontros.length;

        if (total === 0) {
            throw new Error(
                "Nenhuma jornada foi carregada."
            );
        }

        const memoria =
            Memoria.carregar();

        if (
            memoria.encontroAtual >= total
        ) {

            AgendaGuardiao.jornadaConcluida(
                app
            );

            return;

        }

        if (
            !Memoria.podeIniciarAgora(
                memoria
            )
        ) {

            AgendaGuardiao.mostrarEspera(
                app,
                iniciarGuardiao
            );

            return;

        }

        const encontro =
            encontros[
                memoria.encontroAtual
            ];

        if (
            !encontro ||
            !Array.isArray(encontro.cenas)
        ) {

            throw new Error(
                `O encontro ${
                    memoria.encontroAtual + 1
                } não foi encontrado ou não possui cenas.`
            );

        }

        Memoria.iniciarEncontro();

        await Condutor.executar(
            encontro,
            {

                aoSalvarNome(nome) {
                    Memoria.salvarNome(
                        nome
                    );
                },

                aoConcluir() {
                    Memoria.concluirEncontro(
                        total
                    );
                }

            }
        );

    } catch (erro) {

        console.error(
            "Erro ao iniciar o Guardião:",
            erro
        );

        if (app) {

            app.innerHTML = `
                <main class="tela-espera">
                    <p class="fala-guardiao">
                        Não foi possível abrir este encontro.
                    </p>

                    <p class="fala-guardiao fala-secundaria">
                        Abra as ferramentas do navegador para consultar o erro.
                    </p>
                </main>
            `;

        }

    }

}

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarGuardiao,
        { once: true }
    );

} else {

    iniciarGuardiao();

}
