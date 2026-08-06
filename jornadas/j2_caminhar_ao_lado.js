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
                tipo: "jornada",
                rotulo: "Nova Jornada",
                titulo: "Caminhar ao lado das emoções",
                frase: "As emoções não vieram para conduzir seus passos, mas para revelar partes de você que também precisam ser escutadas.",
                texto: [
                    "Que bom que chegamos juntos até aqui.",
                    "Nos primeiros encontros aprendemos algo muito importante: perceber.",
                    "Perceber os pensamentos. Perceber as escolhas. Perceber a nós mesmos.",
                    "Mas perceber foi apenas o começo.",
                    "Agora aprenderemos algo diferente: permanecer perto do que sentimos sem sermos levados por isso.",
                    "Obrigado por continuar caminhando.",
                    "Estarei aqui."
                ],
                botao: "Continuar a caminhada"
            },

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
    },

    {
        id: "J2-E18",
        titulo: "Dar nome ao que chega",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Hoje não quero que você resolva nada.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Quero apenas que perceba o que chegou com você até aqui.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Às vezes sentimos muitas coisas ao mesmo tempo e chamamos tudo de cansaço.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Mas aquilo que recebe um nome costuma ficar um pouco menos confuso.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Sem se apressar, tente reconhecer: o que você está sentindo agora?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Não precisa explicar. Apenas não se abandone."
            }

        ]
    },

    {
        id: "J2-E19",
        titulo: "Nem toda emoção pede ação",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Há sentimentos que parecem exigir uma resposta imediata.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "A raiva quer falar. O medo quer fugir. A tristeza quer se esconder.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Mas sentir não obriga você a agir no mesmo instante.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Entre a emoção e o gesto existe um pequeno espaço.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Talvez hoje você possa simplesmente permanecer nele por alguns segundos.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "O que você sente merece ser ouvido. O que você faz ainda pode ser escolhido."
            }

        ]
    },

    {
        id: "J2-E20",
        titulo: "O corpo percebe primeiro",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Antes de encontrar palavras, o corpo muitas vezes já sabe.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Os ombros endurecem. A respiração encurta. O peito pesa.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Não é preciso interpretar tudo agora.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Apenas observe onde o seu corpo parece pedir mais cuidado.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Hoje, trate esse sinal como um pedido — não como um inimigo."
            }

        ]
    },

    {
        id: "J2-E21",
        titulo: "A emoção que você evita",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Algumas emoções são recebidas com facilidade.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Outras nós tentamos esconder até de nós mesmos.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Talvez porque pareçam frágeis, inadequadas ou difíceis de admitir.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Existe algum sentimento que você costuma afastar antes mesmo de compreendê-lo?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Aquilo que você reconhece já não precisa bater tão forte à porta."
            }

        ]
    },

    {
        id: "J2-E22",
        titulo: "Um pouco de espaço",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Hoje podemos fazer algo simples.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "Respire sem tentar melhorar o momento.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Deixe o ar entrar e sair como ele consegue agora.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Nem todo cuidado começa com uma solução.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Às vezes ele começa quando deixamos de apertar ainda mais aquilo que já dói.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Leve consigo apenas um pouco mais de espaço."
            }

        ]
    },

    {
        id: "J2-E23",
        titulo: "Quando o medo fala",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "O medo nem sempre diz a verdade.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "Mas quase sempre tenta proteger alguma coisa.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Em vez de expulsá-lo, talvez possamos perguntar o que ele teme perder.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "O que o seu medo está tentando proteger hoje?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Ouvir o medo não significa entregar-lhe o caminho."
            }

        ]
    },

    {
        id: "J2-E24",
        titulo: "A tristeza não é pressa",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Há dias em que a tristeza chega sem pedir licença.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "E logo tentamos fazê-la desaparecer.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Mas algumas tristezas não precisam de pressa.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Precisam de presença, descanso e um lugar onde possam existir sem vergonha.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Hoje, não se cobre por estar bem antes da hora."
            }

        ]
    },

    {
        id: "J2-E25",
        titulo: "A raiva e o limite",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "A raiva pode ferir quando toma o comando.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Mas também pode revelar que algum limite foi ultrapassado.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Em vez de perguntar apenas como calá-la, observe o que ela está tentando mostrar.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "texto",
                texto: "Há algum limite seu que precisa ser reconhecido?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "A firmeza não precisa nascer da violência."
            }

        ]
    },

    {
        id: "J2-E26",
        titulo: "O que a alegria revela",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Nem sempre prestamos atenção quando algo nos faz bem.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "A alegria passa e logo voltamos às preocupações.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Mas ela também carrega informações sobre aquilo que nos nutre.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "O que trouxe uma alegria, ainda que pequena, aos seus últimos dias?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Talvez esse pequeno sinal mereça ser lembrado."
            }

        ]
    },

    {
        id: "J2-E27",
        titulo: "Não julgue tão depressa",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Você pode sentir algo e não gostar de estar sentindo.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Isso acontece.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "O problema começa quando, além da emoção, você passa a lutar contra si mesmo.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "texto",
                texto: "Hoje tente trocar o julgamento por curiosidade.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Em vez de dizer “não deveria sentir isso”, pergunte: “o que está acontecendo comigo?”",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Curiosidade abre portas que a culpa costuma fechar."
            }

        ]
    },

    {
        id: "J2-E28",
        titulo: "A emoção não é você",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Você sente tristeza, mas não é apenas tristeza.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Sente medo, mas não é apenas medo.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "As emoções atravessam você; não definem tudo o que você é.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Talvez hoje seja importante lembrar dessa diferença.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Você é também aquele que percebe o que está sentindo."
            }

        ]
    },

    {
        id: "J2-E29",
        titulo: "O peso de fingir",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Fingir que nada aconteceu pode parecer uma forma de seguir.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Mas às vezes o esforço para esconder pesa mais do que a própria emoção.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Há algo em você pedindo para ser reconhecido com honestidade?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Você não precisa anunciar ao mundo. Comece sendo verdadeiro consigo."
            }

        ]
    },

    {
        id: "J2-E30",
        titulo: "Um gesto de cuidado",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Nem toda emoção precisa de uma longa reflexão.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Algumas pedem água, descanso, silêncio ou uma conversa segura.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "O que poderia cuidar de você de forma simples hoje?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Escolha um gesto pequeno o bastante para realmente acontecer."
            }

        ]
    },

    {
        id: "J2-E31",
        titulo: "Quando tudo parece demais",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Existem dias em que não conseguimos separar o que sentimos.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Tudo parece misturado e pesado.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "Nesses dias, talvez baste perguntar: o que precisa de atenção primeiro?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Você não precisa carregar tudo de uma só vez."
            }

        ]
    },

    {
        id: "J2-E32",
        titulo: "A vergonha em silêncio",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "A vergonha costuma nos convencer de que devemos nos esconder.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Ela diz que ser visto seria perigoso.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Mas muitas vezes ela cresce justamente no isolamento.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Existe algo que você poderia compartilhar com alguém confiável, sem se expor além do que deseja?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Cuidado também é escolher onde e com quem ser verdadeiro."
            }

        ]
    },

    {
        id: "J2-E33",
        titulo: "Sentir sem explicar",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Você não precisa compreender completamente uma emoção para respeitá-la.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Algumas coisas só ganham sentido depois.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Hoje permita-se sentir sem construir uma explicação perfeita.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Nem tudo precisa ser traduzido no mesmo instante."
            }

        ]
    },

    {
        id: "J2-E34",
        titulo: "A comparação altera o sentimento",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Às vezes você desvaloriza o que sente porque alguém parece sofrer mais.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Mas a dor do outro não torna a sua inexistente.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Você pode reconhecer ambas sem transformar sofrimento em competição.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "O que você sente não precisa vencer uma comparação para merecer cuidado."
            }

        ]
    },

    {
        id: "J2-E35",
        titulo: "A necessidade por trás da emoção",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Algumas emoções apontam para necessidades que ficaram sem voz.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Descanso. Segurança. Respeito. Proximidade. Espaço.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Talvez a pergunta de hoje não seja apenas “o que estou sentindo?”.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "texto",
                texto: "Talvez seja: “do que estou precisando?”",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Reconhecer uma necessidade não obriga ninguém. Apenas traz clareza."
            }

        ]
    },

    {
        id: "J2-E36",
        titulo: "O sentimento antigo",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Uma situação pequena pode despertar uma emoção muito maior do que o momento parece explicar.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "texto",
                texto: "Talvez ela tenha encontrado algo antigo dentro de você.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Não é preciso voltar ao passado inteiro.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Apenas perceba se o sentimento de hoje parece carregar mais tempo do que este dia.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Às vezes o presente apenas ilumina algo que já estava esperando cuidado."
            }

        ]
    },

    {
        id: "J2-E37",
        titulo: "Não transformar tudo em culpa",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Quando algo dói, é comum procurar rapidamente um culpado.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Às vezes apontamos para alguém. Às vezes apontamos para nós mesmos.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Mas compreender não é o mesmo que condenar.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Você consegue olhar para o que aconteceu sem transformar a reflexão em castigo?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Responsabilidade pode caminhar ao lado da delicadeza."
            }

        ]
    },

    {
        id: "J2-E38",
        titulo: "O alívio também ensina",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Perceba os momentos em que o corpo relaxa um pouco.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Uma pessoa, um lugar, uma música, uma pausa.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "O alívio revela onde você encontra segurança.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "O que costuma ajudá-lo a voltar para si?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Guarde essa resposta como quem guarda um caminho de volta."
            }

        ]
    },

    {
        id: "J2-E39",
        titulo: "Quando a emoção muda",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Nenhuma emoção permanece exatamente igual o tempo todo.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Mesmo quando parece imóvel, ela muda de intensidade, forma ou lugar no corpo.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "texto",
                texto: "Observe por alguns instantes sem tentar conduzir.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Você talvez perceba que sentir também é atravessar."
            }

        ]
    },

    {
        id: "J2-E40",
        titulo: "A palavra certa",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Às vezes usamos a palavra “mal” para sentimentos muito diferentes.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Pode ser solidão. Frustração. Medo. Saudade. Exaustão.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Qual palavra se aproxima mais do que existe em você hoje?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Dar um nome não encerra a emoção. Mas ajuda a encontrá-la."
            }

        ]
    },

    {
        id: "J2-E41",
        titulo: "A solidão acompanhada",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "É possível estar cercado de pessoas e ainda sentir solidão.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Porque presença física nem sempre significa encontro.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Há alguém com quem você gostaria de ser um pouco mais verdadeiro?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Talvez a aproximação possa começar com uma frase simples."
            }

        ]
    },

    {
        id: "J2-E42",
        titulo: "Quando você precisa parar",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Algumas emoções ficam mais intensas quando estamos exaustos.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Nem sempre é falta de força. Às vezes é falta de descanso.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "O que você está tentando resolver cansado demais?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Parar por um instante também pode fazer parte do caminho."
            }

        ]
    },

    {
        id: "J2-E43",
        titulo: "O direito de mudar de ideia",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Você pode ter sentido algo verdadeiro ontem e sentir diferente hoje.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Isso não torna o sentimento anterior falso.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "A vida muda, você muda, e novas informações chegam.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Existe alguma ideia ou decisão que merece ser revista sem vergonha?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Mudar de direção também pode ser um gesto de honestidade."
            }

        ]
    },

    {
        id: "J2-E44",
        titulo: "A delicadeza necessária",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Você talvez fale consigo de um modo que jamais usaria com alguém ferido.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Exigência, ironia, desprezo.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "Hoje observe a voz que aparece quando você erra.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Ela ajuda você a reparar ou apenas aumenta a dor?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Delicadeza não apaga o erro. Ela torna possível olhar para ele."
            }

        ]
    },

    {
        id: "J2-E45",
        titulo: "O que não depende de você",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Há sentimentos nascidos de situações que você não pode controlar.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "A espera, a escolha de outra pessoa, uma mudança já iniciada.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Talvez a paz não venha de controlar o resultado.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Talvez venha de reconhecer o que ainda está em suas mãos.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Hoje cuide da parte que realmente lhe pertence."
            }

        ]
    },

    {
        id: "J2-E46",
        titulo: "A pausa antes da resposta",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Quando uma emoção intensa chega, a primeira resposta nem sempre é a mais verdadeira.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "texto",
                texto: "Pode ser apenas a mais rápida.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "Antes de responder, experimente criar uma pequena pausa.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Alguns segundos podem proteger aquilo que importa."
            }

        ]
    },

    {
        id: "J2-E47",
        titulo: "A saudade e o valor",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "A saudade dói porque algo teve valor.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Ela não é apenas ausência; também é memória de vínculo.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "O que a sua saudade revela sobre aquilo que foi importante para você?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Você pode honrar o que existiu sem permanecer preso ao que passou."
            }

        ]
    },

    {
        id: "J2-E48",
        titulo: "Quando você se sente pequeno",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Existem momentos em que a confiança diminui e tudo parece maior do que você.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "texto",
                texto: "Nesses momentos, não precisa provar grandeza.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Procure apenas a próxima ação possível.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Qual é o menor passo honesto que você consegue dar hoje?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "O caminho também avança em passos que quase ninguém vê."
            }

        ]
    },

    {
        id: "J2-E49",
        titulo: "A emoção do outro",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Conviver também é encontrar emoções que não são suas.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Você pode acolher alguém sem absorver tudo o que a pessoa sente.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Há alguma dor alheia que você está carregando como se fosse sua responsabilidade inteira?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Estar ao lado não exige desaparecer de si."
            }

        ]
    },

    {
        id: "J2-E50",
        titulo: "Um limite sem culpa",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Dizer “não” pode despertar culpa, mesmo quando o limite é necessário.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "A culpa nem sempre significa que você fez algo errado.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Às vezes significa apenas que você fez algo diferente do habitual.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Observe se o desconforto de hoje protege algo importante em você."
            }

        ]
    },

    {
        id: "J2-E51",
        titulo: "O que permanece depois",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Algumas conversas terminam, mas a emoção continua.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Talvez você repasse palavras, gestos e possibilidades.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Antes de procurar uma conclusão, pergunte o que ainda ficou sem ser reconhecido.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Nem sempre precisamos repetir a conversa. Às vezes precisamos escutar o que ela deixou."
            }

        ]
    },

    {
        id: "J2-E52",
        titulo: "A coragem de pedir ajuda",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Pedir ajuda pode parecer uma confissão de fraqueza.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Mas reconhecer um limite também é uma forma de lucidez.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Existe algo que se tornaria menos pesado se você não precisasse fazer sozinho?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "A ajuda certa não retira sua força. Ela impede que você a desperdice."
            }

        ]
    },

    {
        id: "J2-E53",
        titulo: "O tempo da emoção",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Cada emoção tem um ritmo.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "Algumas passam quando são ouvidas. Outras precisam de mais tempo.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Não compare o seu tempo interior com a expectativa de quem está de fora.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Respeitar o próprio ritmo não significa desistir de seguir."
            }

        ]
    },

    {
        id: "J2-E54",
        titulo: "Quando você melhora um pouco",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Talvez algo que doía tenha começado a pesar menos.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Não despreze essa mudança apenas porque ela ainda é pequena.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "O que está um pouco diferente em você nas últimas semanas?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Reconhecer um avanço ajuda a não abandoná-lo."
            }

        ]
    },

    {
        id: "J2-E55",
        titulo: "A paz não é ausência",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Paz não significa nunca sentir medo, tristeza ou raiva.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Talvez seja conseguir permanecer consigo mesmo quando essas emoções chegam.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Você tem conseguido se abandonar menos?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Às vezes a serenidade começa exatamente aí."
            }

        ]
    },

    {
        id: "J2-E56",
        titulo: "Uma conversa necessária",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Há sentimentos que pedem silêncio.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "Outros pedem uma conversa.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "Existe algo importante que você vem adiando dizer com respeito e clareza?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Não ensaie todas as respostas. Prepare apenas a honestidade."
            }

        ]
    },

    {
        id: "J2-E57",
        titulo: "Escolher onde permanecer",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Nem todo ambiente merece acesso contínuo às suas emoções.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Alguns lugares acolhem. Outros diminuem, confundem ou esgotam.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Onde você consegue existir com menos defesa?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Talvez esse lugar — ou essa pessoa — mereça mais presença sua."
            }

        ]
    },

    {
        id: "J2-E58",
        titulo: "O sentimento e a escolha",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Caminhamos por muitos sentimentos até aqui.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Você talvez tenha percebido que acolher não é obedecer.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "A emoção informa. A consciência escolhe.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Que escolha precisa ser feita com calma, mesmo diante do que você sente?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Leve consigo o sentimento — mas não entregue a ele todo o caminho."
            }

        ]
    },

    {
        id: "J2-E59",
        titulo: "O que você aprendeu a ouvir",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "No começo desta jornada, talvez algumas emoções parecessem apenas ruído.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Agora talvez você reconheça nelas sinais, necessidades e limites.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "O que você aprendeu a ouvir em si mesmo?",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Não precisa responder depressa. Algumas respostas já aparecem na maneira como você vive."
            }

        ]
    },

    {
        id: "J2-E60",
        titulo: "Continuar sem se abandonar",
        versao: "4.2",

        cenas: [

            {
                tipo: "texto",
                texto: "Chegamos a um ponto importante da caminhada.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Não porque tudo esteja resolvido.",
                pausa: CONFIG.pausa.curta
            },

            {
                tipo: "texto",
                texto: "Mas porque talvez você já consiga permanecer um pouco mais perto de si.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "Sentir continuará fazendo parte do caminho.",
                pausa: CONFIG.pausa.media
            },

            {
                tipo: "texto",
                texto: "A diferença é que você não precisa mais tratar cada emoção como uma ordem ou uma ameaça.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "texto",
                texto: "Nos próximos encontros, olharemos para as escolhas que nascem depois do que sentimos.",
                pausa: CONFIG.pausa.longa
            },

            {
                tipo: "silencio",
                tempo: CONFIG.pausa.silencio
            },

            {
                tipo: "fim",
                texto: "Continue. Mas continue sem se abandonar."
            }

        ]
    }

];
