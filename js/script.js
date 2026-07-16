/*
======================================================
GUARDIÃO v3.1
INICIALIZAÇÃO
======================================================
*/

const app =
    document.getElementById("guardiao");

async function iniciarGuardiao() {
    if (!app) {
        throw new Error(
            "Elemento #guardiao não encontrado."
        );
    }

    AgendaGuardiao.pararRelogio();

    if (
        typeof JORNADA1 === "undefined" ||
        !Array.isArray(JORNADA1)
    ) {
        throw new Error(
            "JORNADA1 não foi encontrada ou não é um array."
        );
    }

    const memoria = Memoria.carregar();
    const total = JORNADA1.length;

    if (memoria.encontroAtual >= total) {
        AgendaGuardiao.jornadaConcluida(
            app
        );
        return;
    }

    if (!Memoria.podeIniciarAgora(memoria)) {
        AgendaGuardiao.mostrarEspera(
            app,
            iniciarGuardiao
        );
        return;
    }

    const encontro =
        JORNADA1[memoria.encontroAtual];

    Memoria.iniciarEncontro();

    await Condutor.executar(
        encontro,
        {
            aoConcluir() {
                Memoria.concluirEncontro(
                    total
                );
            }
        }
    );
}

document.addEventListener(
    "DOMContentLoaded",
    iniciarGuardiao
);
