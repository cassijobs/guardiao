/*
======================================================
GUARDIÃO v3.7
INICIALIZAÇÃO DAS JORNADAS
======================================================
Une todas as jornadas carregadas em uma única sequência.

Para acrescentar uma nova jornada futuramente:

1. Adicione o arquivo no index.html.
2. Acrescente a jornada na lista JORNADAS:

const JORNADAS = [
    JORNADA1,
    JORNADA2,
    JORNADA3
];
======================================================
*/

const app =
    document.getElementById("guardiao");


/*
======================================================
JORNADAS DISPONÍVEIS
======================================================
A ordem abaixo é a ordem da caminhada.
======================================================
*/

const JORNADAS = [
    JORNADA1,
    JORNADA2
];


/*
======================================================
VALIDAÇÃO
======================================================
*/

function validarJornadas() {

    if (!Array.isArray(JORNADAS)) {
        throw new Error(
            "A lista JORNADAS não é válida."
        );
    }

    JORNADAS.forEach(
        (jornada, indice) => {

            if (!Array.isArray(jornada)) {

                throw new Error(
                    `A Jornada ${indice + 1} não foi encontrada ou não é um array.`
                );

            }

        }
    );

}


/*
======================================================
TODOS OS ENCONTROS
======================================================
Transforma várias jornadas em uma sequência única.
======================================================
*/

function obterTodosOsEncontros() {

    validarJornadas();

    return JORNADAS.flat();

}


/*
======================================================
INICIAR GUARDIÃO
======================================================
*/

async function iniciarGuardiao() {

    /*
     * Quando as ferramentas estão abertas,
     * nenhum encontro deve começar.
     */
    if (
        window.GUARDIAO_MODO_DEV === true
    ) {
        return;
    }

    if (!app) {

        throw new Error(
            "Elemento #guardiao não encontrado."
        );

    }

    AgendaGuardiao.pararRelogio();

    const todosOsEncontros =
        obterTodosOsEncontros();

    const memoria =
        Memoria.carregar();

    const total =
        todosOsEncontros.length;


    /*
    ==================================================
    FIM DE TODAS AS JORNADAS CARREGADAS
    ==================================================
    */

    if (
        memoria.encontroAtual >= total
    ) {

        AgendaGuardiao.jornadaConcluida(
            app
        );

        return;

    }


    /*
    ==================================================
    CHEGADA ANTECIPADA
    ==================================================
    */

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
    ==================================================
    RECONHECER QUE A PESSOA ESPEROU
    ==================================================
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


    /*
    ==================================================
    ENCONTRO ATUAL
    ==================================================
    */

    const encontro =
        todosOsEncontros[
            memoria.encontroAtual
        ];

    if (!encontro) {

        throw new Error(
            `O encontro ${memoria.encontroAtual + 1} não foi encontrado.`
        );

    }

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
======================================================
CARREGAMENTO
======================================================
*/

if (
    window.GUARDIAO_MODO_DEV !== true
) {

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            iniciarGuardiao
        );

    } else {

        iniciarGuardiao();

    }

}
