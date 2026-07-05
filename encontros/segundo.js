/*
======================================================
GUARDIÃO v2.0.1
SEGUNDO ENCONTRO
======================================================
*/

const SEGUNDO_ENCONTRO = {
    id: "segundo_encontro",
    titulo: "O Retorno",
    versao: "1.0",

    cenas: [
        {
            tipo: "texto",
            texto: "Você voltou...",
            pausa: CONFIG.pausa.longa
        },

        {
            tipo: "texto",
            texto: "Nem toda caminhada continua no mesmo ritmo.",
            pausa: CONFIG.pausa.longa
        },

        {
            tipo: "texto",
            texto: "Mas todo retorno carrega algum significado.",
            pausa: CONFIG.pausa.longa
        },

        {
            tipo: "texto",
            texto: "Pergunte-se.",
            pausa: CONFIG.pausa.media
        },

        {
            tipo: "texto",
            texto: "O que você percebeu desde nosso último encontro?",
            pausa: CONFIG.pausa.longa
        },

        {
            tipo: "silencio",
            tempo: CONFIG.pausa.silencio
        },

        {
            tipo: "texto",
            texto: "Não tente transformar tudo em resposta.",
            pausa: CONFIG.pausa.media
        },

        {
            tipo: "texto",
            texto: "Às vezes, perceber já é o começo.",
            pausa: CONFIG.pausa.longa
        },

        {
            tipo: "fim",
            texto: "Leve isso com você. O restante amadurece no caminho."
        }
    ]
};
