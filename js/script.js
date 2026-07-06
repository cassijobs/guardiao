/*
======================================================
GUARDIÃO v2.0.1
SCRIPT PRINCIPAL
======================================================
*/

window.addEventListener("load", iniciar);

async function iniciar() {

    const parametros = new URLSearchParams(window.location.search);

    if (parametros.get("reset") === "1") {

        MEMORIA.resetar();

    } else {

        MEMORIA.carregar();

    }

    const encontros = JORNADA1;

    let indice = MEMORIA.encontroAtual - 1;

    if (!MEMORIA.nome) {

        indice = 0;

    }

    if (indice < 0 || indice >= encontros.length) {

        indice = encontros.length - 1;

    }

    await Condutor.executar(

        encontros[indice]

    );

}
