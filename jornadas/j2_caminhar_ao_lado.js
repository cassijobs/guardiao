/*
======================================================
GUARDIÃO v4.2
JORNADA 2 — CAMINHAR AO LADO
======================================================

Compatível com o Condutor atual:

- cenas
- texto
- pausa
- silencio com tempo
- fim
======================================================
*/

const JORNADA2 = [

    {
        id: "J2-E16",
        titulo: "É bom revê-lo",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "É bom revê-lo.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Obrigado por reservar mais alguns instantes para você.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Já caminhamos um pequeno trecho juntos.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "Talvez você ainda não tenha percebido, mas cada encontro deixa uma pequena marca.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "texto",
                texto: "A partir de hoje, nossa caminhada muda um pouco.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Continuarei fazendo perguntas.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "Mas, às vezes, apenas conversaremos.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Antes de ir, leve apenas esta pergunta com você.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "O que mudou em você desde o nosso primeiro encontro?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Até nosso próximo encontro."
            }

        ]
    },

    {
        id: "J2-E17",
        titulo: "Caminhar ao seu lado",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Ontem eu disse que nossa caminhada seria um pouco diferente.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Hoje quero lhe contar apenas uma coisa.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "Eu não caminho à sua frente para mostrar o caminho.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Também não caminho atrás para empurrá-lo.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Caminho ao seu lado, porque algumas jornadas ficam mais leves quando não são percorridas sozinho.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "texto",
                texto: "Não espere de mim respostas para todas as perguntas.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Mas espero estar presente enquanto você encontra as suas.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "fim",
                texto: "Até nosso próximo encontro."
            }

        ]
    }

];
