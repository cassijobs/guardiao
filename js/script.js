/*
======================================================
GUARDIÃO v3.3
INICIALIZAÇÃO
======================================================
Impede o encontro de começar quando o endereço
contiver ?dev.
======================================================
*/

const app =
    document.getElementById("guardiao");

/*
 * Esta verificação acontece imediatamente,
 * antes de registrar o início do encontro.
 */
const PARAMETROS =
    new URLSearchParams(
        window.location.search
    );

const MODO_DEV =
    PARAMETROS.has("dev");


async function iniciarGuardiao() {

    /*
     * Segurança adicional:
     * no modo desenvolvedor, o encontro nunca começa.
     */
    if (MODO_DEV) {
        return;
    }

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
            Memoria.registrarVisitaAntecipada();

        AgendaGuardiao.mostrarEspera(
            app,
            iniciarGuardiao,
            memoriaAtualizada
                .visitasAntecipadas
        );

        return;
    }

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


/*
 * O evento só é registrado quando não estamos
 * no modo desenvolvedor.
 */
if (!MODO_DEV) {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarGuardiao
    );
}
