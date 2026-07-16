/*
======================================================
GUARDIÃO v3.2
INICIALIZAÇÃO
======================================================
Reconhece quando a pessoa chegou cedo e esperou.
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

    const memoria =
        Memoria.carregar();

    const total =
        JORNADA1.length;

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

        const memoriaAtualizada =
            Memoria
                .registrarVisitaAntecipada();

        AgendaGuardiao.mostrarEspera(
            app,
            iniciarGuardiao,
            memoriaAtualizada
                .visitasAntecipadas
        );

        return;

    }

    /*
     * Se a pessoa chegou cedo e agora
     * chegou o momento do encontro,
     * o Guardião reconhece a espera.
     */
    if (
        Memoria.consumirEsperaCumprida()
    ) {

        Palco.iniciar();

        await Palco.mostrarTexto(
            "Você esperou."
        );

        await Palco.esperar(
            CONFIG.pausa.media
        );

        await Palco.mostrarTexto(
            "Obrigado."
        );

        await Palco.esperar(
            CONFIG.pausa.media
        );

    }

    const encontro =
        JORNADA1[
            memoria.encontroAtual
        ];

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
