/*
======================================================
GUARDIÃO v2.0.1
TERCEIRO ENCONTRO
======================================================
*/

const TERCEIRO_ENCONTRO = {
    id: "terceiro_encontro",
    titulo: "O Terceiro Passo",
    versao: "1.0",

    cenas: [
        {
            tipo: "texto",
            texto: "Outra vez, {nome}.",
            pausa: CONFIG.pausa.longa
        },

        {
            tipo: "texto",
            texto: "Três encontros não formam um destino.",
            pausa: CONFIG.pausa.longa
        },

        {
            tipo: "texto",
            texto: "Mas já começam a desenhar um caminho.",
            pausa: CONFIG.pausa.longa
        },

        {
            tipo: "texto",
            texto: "Observe.",
            pausa: CONFIG.pausa.media
        },

        {
            tipo: "texto",
            texto: "Que pequena atitude sua tem se repetido sem que você perceba?",
            pausa: CONFIG.pausa.longa
        },

        {
            tipo: "silencio",
            tempo: CONFIG.pausa.silencio
        },

        {
            tipo: "texto",
            texto: "Nem tudo que se repete é prisão.",
            pausa: CONFIG.pausa.media
        },

        {
            tipo: "texto",
            texto: "Algumas repetições são sementes.",
            pausa: CONFIG.pausa.longa
        },

        {
            tipo: "fim",
            texto: "Agora siga. A vida continuará esta conversa."
        }
    ]
};
