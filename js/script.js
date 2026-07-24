/*
======================================================
GUARDIÃO v4.1
INICIALIZAÇÃO DAS JORNADAS
======================================================
*/

function obterAreaGuardiao() {

    let guardiao =
        document.getElementById("guardiao");

    if (guardiao) {
        return guardiao;
    }

    const app =
        document.getElementById("app");

    if (!app) {
        throw new Error(
            "Não foi encontrado #guardiao nem #app."
        );
    }

    guardiao =
        document.createElement("main");

    guardiao.id = "guardiao";

    app.innerHTML = "";
    app.appendChild(guardiao);

    return guardiao;

}

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

    /*
     * Quando ?dev está presente, dev.js é responsável
     * pela tela. O encontro normal não deve iniciar.
     */
    if (
        window.GUARDIAO_DEV_ATIVO === true
    ) {
        return;
    }

    const app =
        obterAreaGuardiao();

    try {

        AgendaGuardiao.pararRelogio();

        const encontros =
            obterTodosOsEncontros();

        const total =
            encontros.length;

        if (total === 0) {
            throw new Error(
                "Nenhum encontro foi carregado."
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
    await FornecedorEncontros.buscar(
        memoria.encontroAtual,
        encontros
    );

        if (
            !encontro ||
            !Array.isArray(encontro.cenas)
        ) {

            throw new Error(
                `Encontro ${
                    memoria.encontroAtual + 1
                } inválido ou sem cenas.`
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

        app.innerHTML = `
            <main class="tela-espera">
                <p class="fala-guardiao">
                    Não foi possível abrir esse encontro.
                </p>

                <p class="fala-guardiao fala-secundaria">
                    Use <strong>?dev</strong> para abrir as ferramentas.
                </p>
            </main>
        `;

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
