/*
======================================================
GUARDIÃO v2.1
JORNADA I — O ENCONTRO CONSIGO MESMO
======================================================
*/

const JORNADA1 = [

    {
        id: "J1-E01",
        titulo: "O Primeiro Encontro",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Você veio...",
                pausa: 3000
            },

            {
                tipo: "texto",
                texto: "Imaginei que você viria.",
                pausa: 4000
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
                tipo: "texto",
                texto: "Fico feliz que tenha vindo.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Podemos ficar aqui por alguns instantes.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Não há nenhuma pressa.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "texto",
                texto: "Não preciso saber nada sobre você hoje.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Cada história tem seu próprio tempo para ser contada.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "texto",
                texto: "Por enquanto...",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "basta estarmos aqui.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "fim",
                texto: "Amanhã nos encontraremos novamente. Até lá... cuide de si."
            }

        ]
    },

    {
        id: "J1-E02",
        titulo: "Os Primeiros Pensamentos",
        versao: "2.1",

        cenas: [

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
                texto: "Apenas observe e pense a respeito."
            }

        ]
    },

    {
        id: "J1-E03",
        titulo: "As Pequenas Escolhas",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Ontem pedi apenas que observasse seus primeiros pensamentos.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Eles costumam acompanhar as primeiras escolhas do dia.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Nossa vida raramente muda de uma só vez.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Ela costuma mudar em pequenos passos.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Então observe...",
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
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Ontem conversamos sobre pequenas escolhas.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Existe algo que costuma vir antes delas.",
                pausa: 4000
            },

            {
                tipo: "texto",
                texto: "Sua atenção.",
                pausa: 3000
            },

            {
                tipo: "texto",
                texto: "Ela é um dos bens mais preciosos que você possui.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Aquilo que recebe sua atenção com frequência, pouco a pouco, ganha espaço dentro de você.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "É por isso que tantas escolhas começam por ela.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Então observe...",
                pausa: 3000
            },

            {
                tipo: "texto",
                texto: "O que mais recebeu sua atenção hoje?",
                pausa: 8000
            },

            {
                tipo: "silencio",
                tempo: 3000
            },

            {
                tipo: "texto",
                texto: "Não responda agora.",
                pausa: 4000
            },

            {
                tipo: "texto",
                texto: "Apenas leve essa pergunta com você.",
                pausa: 5000
            },

            {
                tipo: "fim",
                texto: "Porque, aos poucos, sua atenção ajuda a construir o caminho que você percorre."
            }

        ]
    },

    {
        id: "J1-E05",
        titulo: "As Reações",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Ontem você observou para onde sua atenção foi levada.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Hoje observe o que acontece logo depois.",
                pausa: 4000
            },

            {
                tipo: "texto",
                texto: "Às vezes, reagimos antes mesmo de compreender aquilo que aconteceu.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "Em que momento do dia isso aconteceu com você?",
                pausa: 8000
            },

            {
                tipo: "silencio",
                tempo: 3000
            },

            {
                tipo: "texto",
                texto: "Nem toda resposta precisa nascer imediatamente.",
                pausa: 5000
            },

            {
                tipo: "fim",
                texto: "Hoje, experimente compreender um pouco antes de reagir."
            }

        ]
    },

    {
        id: "J1-E06",
        titulo: "Ouvir",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Ontem falamos sobre compreender antes de reagir.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Existe uma forma simples de começar.",
                pausa: 4000
            },

            {
                tipo: "texto",
                texto: "Ouvir.",
                pausa: 3000
            },

            {
                tipo: "texto",
                texto: "Há uma diferença silenciosa entre ouvir alguém... e apenas esperar a sua vez de falar.",
                pausa: 8000
            },

            {
                tipo: "silencio",
                tempo: 2000
            },

            {
                tipo: "texto",
                texto: "Hoje, perceba um momento em que você realmente ouviu alguém.",
                pausa: 7000
            },

            {
                tipo: "fim",
                texto: "Talvez compreender comece quando deixamos espaço para o outro existir."
            }

        ]
    },

    {
        id: "J1-E07",
        titulo: "O Automático",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Quando ouvimos com atenção, percebemos coisas que antes passavam despercebidas.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "Inclusive em nós mesmos.",
                pausa: 4000
            },

            {
                tipo: "texto",
                texto: "Muitas atitudes acontecem sem que as escolhamos conscientemente.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "É como caminhar por uma estrada conhecida sem notar o caminho.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "Hoje observe um momento em que você agiu no automático.",
                pausa: 8000
            },

            {
                tipo: "fim",
                texto: "Aquilo que você percebe deixa de ser completamente invisível."
            }

        ]
    },

    {
        id: "J1-E08",
        titulo: "Pensamentos que Retornam",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Ontem você observou um gesto que aconteceu no automático.",
                pausa: 6000
            },

            {
                tipo: "texto",
                texto: "Alguns gestos se repetem porque certos pensamentos também retornam.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "Nem sempre esses pensamentos querem incomodar.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Às vezes, apenas pedem para ser compreendidos.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Qual pensamento mais retornou à sua mente hoje?",
                pausa: 8000
            },

            {
                tipo: "silencio",
                tempo: 3000
            },

            {
                tipo: "fim",
                texto: "Talvez ele esteja tentando mostrar algo que você ainda não conseguiu nomear."
            }

        ]
    },

    {
        id: "J1-E09",
        titulo: "A Pequena Pausa",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Ontem você observou um pensamento que costuma retornar.",
                pausa: 6000
            },

            {
                tipo: "texto",
                texto: "Hoje não quero que lute contra ele.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Quero apenas lhe oferecer uma pausa.",
                pausa: 5000
            },

            {
                tipo: "silencio",
                tempo: 3000
            },

            {
                tipo: "texto",
                texto: "Entre aquilo que acontece e aquilo que você faz... existe um pequeno espaço.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "Nesse espaço, uma escolha pode nascer.",
                pausa: 5000
            },

            {
                tipo: "fim",
                texto: "Hoje, tente perceber esse espaço antes de seguir."
            }

        ]
    },

    {
        id: "J1-E10",
        titulo: "As Palavras",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Ontem falamos sobre o pequeno espaço antes de uma escolha.",
                pausa: 6000
            },

            {
                tipo: "texto",
                texto: "Muitas vezes, é nesse espaço que uma palavra ganha forma.",
                pausa: 6000
            },

            {
                tipo: "texto",
                texto: "Algumas palavras aproximam.",
                pausa: 4000
            },

            {
                tipo: "texto",
                texto: "Outras afastam antes mesmo de serem compreendidas.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Qual palavra saiu de você com mais força hoje?",
                pausa: 8000
            },

            {
                tipo: "silencio",
                tempo: 3000
            },

            {
                tipo: "fim",
                texto: "Observe não apenas o que você disse, mas também de onde essa palavra veio."
            }

        ]
    },

    {
        id: "J1-E11",
        titulo: "O Olhar",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Ontem você observou uma palavra que saiu de você com força.",
                pausa: 6000
            },

            {
                tipo: "texto",
                texto: "As palavras revelam muito da maneira como estamos olhando.",
                pausa: 6000
            },

            {
                tipo: "texto",
                texto: "Para os outros.",
                pausa: 3000
            },

            {
                tipo: "texto",
                texto: "E também para nós mesmos.",
                pausa: 4000
            },

            {
                tipo: "texto",
                texto: "Hoje, experimente olhar para si com a mesma gentileza que gostaria de receber.",
                pausa: 9000
            },

            {
                tipo: "silencio",
                tempo: 3000
            },

            {
                tipo: "fim",
                texto: "Gentileza não esconde a verdade. Apenas permite que ela seja vista sem crueldade."
            }

        ]
    },

    {
        id: "J1-E12",
        titulo: "Sem Pressa",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Ontem você experimentou olhar para si com mais gentileza.",
                pausa: 6000
            },

            {
                tipo: "texto",
                texto: "Talvez tenha percebido algo que gostaria de mudar.",
                pausa: 6000
            },

            {
                tipo: "texto",
                texto: "Mas mudanças profundas raramente acontecem com violência.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "Elas crescem em silêncio, enquanto continuamos caminhando.",
                pausa: 7000
            },

            {
                tipo: "fim",
                texto: "Hoje, não se apresse para se tornar alguém diferente. Apenas continue atento."
            }

        ]
    },

    {
        id: "J1-E13",
        titulo: "O Invisível",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Ontem conversamos sobre mudanças que não precisam ser apressadas.",
                pausa: 6000
            },

            {
                tipo: "texto",
                texto: "Talvez você ainda não consiga vê-las.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Mesmo assim, toda caminhada deixa marcas.",
                pausa: 6000
            },

            {
                tipo: "texto",
                texto: "Nem todas aparecem nos pés.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Algumas surgem na maneira como começamos a enxergar a vida.",
                pausa: 7000
            },

            {
                tipo: "fim",
                texto: "O que está mudando em seu olhar, mesmo que ninguém mais perceba?"
            }

        ]
    },

    {
        id: "J1-E14",
        titulo: "O Caminho",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Ontem você observou aquilo que talvez esteja mudando em seu olhar.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "No início desta caminhada, talvez esperasse encontrar respostas.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "Espero que tenha encontrado perguntas melhores.",
                pausa: 7000
            },

            {
                tipo: "silencio",
                tempo: 3000
            },

            {
                tipo: "texto",
                texto: "Algumas perguntas merecem ser vividas antes de serem respondidas.",
                pausa: 8000
            },

            {
                tipo: "fim",
                texto: "Talvez o caminho não esteja apenas diante de você. Talvez também esteja sendo construído dentro de você."
            }

        ]
    },

    {
        id: "J1-E15",
        titulo: "O Primeiro Trecho",
        versao: "2.1",

        cenas: [

            {
                tipo: "texto",
                texto: "Chegamos ao fim do primeiro trecho da nossa caminhada.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "Antes de seguirmos adiante, olhe por alguns instantes para o caminho percorrido.",
                pausa: 8000
            },

            {
                tipo: "texto",
                texto: "Você observou pensamentos, escolhas, atenção, reações, palavras e silêncios.",
                pausa: 8000
            },

            {
                tipo: "texto",
                texto: "Talvez nada disso tenha lhe oferecido uma resposta definitiva.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "Mas talvez tenha mudado um pouco a maneira como você olha.",
                pausa: 7000
            },

            {
                tipo: "texto",
                texto: "Se pudesse conversar com a pessoa que iniciou esta jornada... o que você lhe diria hoje?",
                pausa: 10000
            },

            {
                tipo: "silencio",
                tempo: 5000
            },

            {
                tipo: "texto",
                texto: "Não precisa responder agora.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Algumas respostas só aparecem depois que a vida participa da conversa.",
                pausa: 8000
            },

            {
                tipo: "texto",
                texto: "Você concluiu a primeira etapa.",
                pausa: 5000
            },

            {
                tipo: "texto",
                texto: "Nossa caminhada continua.",
                pausa: 5000
            },

            {
                tipo: "fim",
                texto: "Até o próximo encontro."
            }

        ]
    }

];
