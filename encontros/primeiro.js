/*
======================================================
GUARDIÃO v2.0.1
PRIMEIRO ENCONTRO
======================================================
*/

const PRIMEIRO_ENCONTRO = {
    id: "primeiro_encontro",
    titulo: "O Primeiro Encontro",
    versao: "1.0",

    cenas: [
        {
            tipo: "texto",
            texto: "Você veio...",
            pausa: 3000
        },

        {
            tipo: "texto",
            texto: "Imaginei que você viria.",
            pausa: 3000
        },

        {
            tipo: "texto",
            texto: "Antes de caminharmos juntos...",
            pausa: CONFIG.pausa.longa
        },

        {
            tipo: "nome",
            pergunta: "Como devo chamá-lo?"
        },

        {
            tipo: "texto",
            texto: "Obrigado, {nome}.",
            pausa: CONFIG.pausa.media
        },

        {
            tipo: "texto",
            texto: "Agora conheço a forma como o mundo chama você.",
            pausa: CONFIG.pausa.longa
        },

        {
            tipo: "escolha",
            id: "compromisso_reflexao",
            pergunta: "Você está disposto a reservar alguns instantes para refletir sobre si mesmo?",
            pausa: CONFIG.pausa.leitura,
            positivo: "Sim",
            negativo: "Ainda não",
            seNegativo: [
                {
                    tipo: "fim",
                    texto: "Tudo tem seu tempo."
                }
            ]
        },

        {
            tipo: "texto",
            texto: "Pergunte-se.",
            pausa: 3000
        },

        {
            tipo: "texto",
            texto: "Qual foi a última escolha que fez você sentir orgulho de quem está se tornando?",
            pausa: 14000
        },

        {
            tipo: "silencio",
            tempo: 8000
        },

        {
            tipo: "texto",
            texto: "Não responda agora.",
            pausa: 5000
        },

        {
            tipo: "texto",
            texto: "Viva primeiro.",
            pausa: 5000
        },

        {
            tipo: "texto",
            texto: "Algumas respostas só aparecem depois que a vida participa da conversa.",
            pausa: 8000
        },

        {
            tipo: "fim",
            texto: "O restante deste encontro acontecerá longe de mim."
        }
    ]
};
