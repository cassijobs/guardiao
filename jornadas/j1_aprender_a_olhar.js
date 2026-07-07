
/*
======================================================
GUARDIÃO v2.0.1
JORNADA I — O ENCONTRO CONSIGO MESMO
======================================================
*/

const JORNADA1 = [

    {
        id: "J1-E01",
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
                pausa: 3000,
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
                pausa: 8000
            },

            {
                tipo: "silencio",
                tempo: 3000
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
    },

{
    id: "J1-E02",
    titulo: "Os Primeiros Pensamentos",
    versao: "1.0",

    cenas: [

        {
            tipo: "texto",
            texto: "Você voltou.",
            pausa: 3000
        },

        {
            tipo: "texto",
            texto: "Ontem iniciamos uma caminhada.",
            pausa: 4000
        },

        {
            tipo: "texto",
            texto: "Hoje quero apenas que observe uma coisa.",
            pausa: 4000
        },

        {
            tipo: "texto",
            texto: "O que costuma ocupar seus primeiros pensamentos ao acordar?",
            pausa: 8000
        },

        {
            tipo: "silencio",
            tempo: 3000
        },

        {
            tipo: "texto",
            texto: "Não tente responder agora.",
            pausa: 4000
        },

        {
            tipo: "fim",
            texto: "Apenas observe."
        }

    ]

},

{
    id: "J1-E03",
    titulo: "As Pequenas Escolhas",
    versao: "1.0",

    cenas: [

        {
            tipo: "texto",
            texto: "Você voltou.",
            pausa: 3000
        },

        {
            tipo: "texto",
            texto: "Nossa vida costuma mudar em pequenos passos.",
            pausa: 5000
        },

        {
            tipo: "texto",
            texto: "Observe apenas isto.",
            pausa: 3000
        },

        {
            tipo: "texto",
            texto: "Quantas das suas atitudes de hoje foram realmente escolhidas... e quantas apenas repetidas?",
            pausa: 8000
        },

        {
            tipo: "silencio",
            tempo: 3000
        },

        {
            tipo: "fim",
            texto: "Perceber já é um começo."
        }

    ]

},

{
    id: "J1-E04",
    titulo: "A Atenção",
    versao: "1.0",

    cenas: [

        {
            tipo: "texto",
            texto: "Hoje observaremos outra coisa.",
            pausa: 4000
        },

        {
            tipo: "texto",
            texto: "Sua atenção.",
            pausa: 3000
        },

        {
            tipo: "texto",
            texto: "Ela é um dos seus bens mais valiosos.",
            pausa: 5000
        },

        {
            tipo: "texto",
            texto: "O que mais roubou sua atenção hoje?",
            pausa: 8000
        },

        {
            tipo: "silencio",
            tempo: 3000
        },

        {
            tipo: "fim",
            texto: "Aquilo que recebe sua atenção começa, pouco a pouco, a dirigir sua vida."
        }

    ]

},

{
    id: "J1-E05",
    titulo: "As Reações",
    versao: "1.0",

    cenas: [

        {
            tipo: "texto",
            texto: "Hoje não observe o mundo.",
            pausa: 4000
        },

        {
            tipo: "texto",
            texto: "Observe você dentro dele.",
            pausa: 4000
        },

        {
            tipo: "texto",
            texto: "Em que momento do dia você reagiu antes de compreender a situação?",
            pausa: 8000
        },

        {
            tipo: "silencio",
            tempo: 3000
        },

        {
            tipo: "texto",
            texto: "Nem toda resposta precisa nascer imediatamente.",
            pausa: 4000
        },

        {
            tipo: "fim",
            texto: "Hoje, permita-se compreender antes de reagir."
        }

    ]

} 
    {
    id: "J1-E06",
    titulo: "Ouvir",
    versao: "1.0",

    cenas: [

        {
            tipo: "texto",
            texto: "Ontem eu lhe pedi que observasse suas reações.",
            pausa: 5000
        },

        {
            tipo: "texto",
            texto: "Hoje quero lhe mostrar outra coisa.",
            pausa: 4000
        },

        {
            tipo: "texto",
            texto: "Existe uma diferença silenciosa entre ouvir alguém... e apenas esperar a sua vez de falar.",
            pausa: 7000
        },

        {
            tipo: "silencio",
            tempo: 2000
        },

        {
            tipo: "texto",
            texto: "Hoje, apenas perceba quando você realmente ouviu alguém.",
            pausa: 7000
        },

        {
            tipo: "fim",
            texto: "Agora permita que esta reflexão acompanhe o restante do seu dia."
        }

    ]
}
{
    id: "J1-E07",
    titulo: "O Automático",
    versao: "1.0",

    cenas: [

        {
            tipo: "texto",
            texto: "Quanto mais observamos... mais percebemos que muitas atitudes acontecem sem que as escolhamos.",
            pausa: 7000
        },

        {
            tipo: "texto",
            texto: "É como caminhar por um caminho conhecido.",
            pausa: 5000
        },

        {
            tipo: "texto",
            texto: "Hoje observe apenas um momento em que você agiu no automático.",
            pausa: 8000
        },

        {
            tipo: "fim",
            texto: "Agora permita que esta reflexão acompanhe o restante do seu dia."
        }

    ]
}
];
