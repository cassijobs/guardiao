window.addEventListener("load", iniciar);

const RETORNO_DO_DIA = {
    id: "retorno_do_dia",
    titulo: "Retorno do Dia",
    versao: "1.0",

    cenas: [

        {
            tipo: "texto",
            texto: "Nem toda pergunta espera uma resposta.",
            pausa: 4000
        },

        {
            tipo: "texto",
            texto: "Algumas esperam uma transformação.",
            pausa: 5000
        },

        {
            tipo: "fim",
            texto: "Amanhã caminharemos um pouco mais."
        }

    ]
};

async function iniciar() {

    const parametros = new URLSearchParams(window.location.search);

    if (parametros.get("reset") === "1") {

        MEMORIA.resetar();

    } else {

        MEMORIA.carregar();

    }

    const encontros = JORNADA1;

    if (DEV.ativo) {

        MEMORIA.nome = DEV.nome;

    }

    if (!DEV.ativo || !DEV.ignorarTravaDiaria) {

        if (MEMORIA.nome && MEMORIA.jaFezHoje()) {

            await Condutor.executar(RETORNO_DO_DIA);

            return;

        }

    }

    let indice = MEMORIA.encontroAtual - 1;

    if (DEV.ativo) {

        indice = DEV.encontro - 1;

    }

    if (!DEV.ativo && !MEMORIA.nome) {

        indice = 0;

    }

    if (indice < 0 || indice >= encontros.length) {

        indice = encontros.length - 1;

    }

    await Condutor.executar(

        encontros[indice]

    );

    if (!DEV.ativo) {

        MEMORIA.concluirEncontro(encontros.length);

    }

}
