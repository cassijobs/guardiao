
/*
======================================================
GUARDIÃO v2.0
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
            texto: "Você veio..."
        },

        {
            tipo: "texto",
            texto: "Imaginei que você viria."
        },

        {
            tipo: "texto",
            texto: "Antes de caminharmos juntos..."
        },

        {
            tipo: "nome",
            pergunta: "Como devo chamá-lo?"
        },

        {
            tipo: "texto",
            texto: "Obrigado, {nome}."
        },

        {
            tipo: "texto",
            texto: "Agora conheço a forma como o mundo chama você."
        },

        {
            tipo: "escolha",

            pergunta:
                "Você está disposto a reservar alguns instantes para refletir sobre si mesmo?",

            positivo: "Sim",

            negativo: "Ainda não"

        },

        {
            tipo: "texto",
            texto: "Pergunte-se."
        },

        {
            tipo: "texto",

            texto:
                "Qual foi a última escolha que fez você sentir orgulho de quem está se tornando?"

        },

        {
            tipo: "silencio",

            tempo: CONFIG.pausa.silencio

        },

        {
            tipo: "texto",
            texto: "Não responda agora."
        },

        {
            tipo: "texto",
            texto: "Viva primeiro."
        },

        {
            tipo: "texto",

            texto:
                "Algumas respostas só aparecem depois que a vida participa da conversa."

        },

        {
            tipo: "fim",

            texto:
                "O restante deste encontro acontecerá longe de mim."

        }

    ]

};
