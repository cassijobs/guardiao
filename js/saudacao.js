/*
======================================================
GUARDIÃO v4.0
SAUDAÇÕES E PRESENÇA
======================================================
Centraliza a voz do Guardião conforme o momento do dia.
Este arquivo pode crescer com datas especiais, aniversário,
retorno após ausência e outras formas de acolhimento.
======================================================
*/

const SaudacaoGuardiao = (() => {

    function horaAtual() {
        return new Date().getHours();
    }

    function periodoDoDia(hora = horaAtual()) {
        if (hora >= 5 && hora < 12) return "manha";
        if (hora >= 12 && hora < 18) return "tarde";
        if (hora >= 18 && hora < 22) return "noite";
        return "madrugada";
    }

    const ABERTURAS = {
        manha: [
            ["Bom dia.", "Há um novo dia diante de você.", "Comecemos com calma."],
            ["Bom dia.", "O dia ainda está abrindo seus caminhos.", "Reserve este instante para você."],
            ["Um novo amanhecer chegou.", "Você não precisa resolver tudo agora.", "Comecemos pelo que cabe neste momento."]
        ],
        tarde: [
            ["Boa tarde.", "Em meio ao movimento do dia, você encontrou este instante.", "Vamos caminhar um pouco."],
            ["Boa tarde.", "Talvez o dia já tenha pedido muito de você.", "Por alguns instantes, apenas respire."],
            ["O dia segue seu curso.", "E você encontrou um pequeno espaço dentro dele.", "Vamos aproveitá-lo juntos."]
        ],
        noite: [
            ["Boa noite.", "O dia começa a se recolher.", "Talvez este seja um bom momento para você também respirar."],
            ["Boa noite.", "O que passou hoje já começa a encontrar seu lugar.", "Vamos permanecer aqui por alguns instantes."],
            ["A noite chegou.", "Nem tudo precisa ser levado adiante com o mesmo peso.", "Vamos conversar com calma."]
        ],
        madrugada: [
            ["A noite está silenciosa.", "Quando for dormir, relaxe.", "Deixe o descanso agir sobre aquilo que hoje ainda pesa."],
            ["Ainda é noite.", "Nem todas as respostas precisam aparecer antes do sono.", "Permita que o descanso também faça parte da caminhada."],
            ["Neste horário, o mundo parece falar mais baixo.", "Talvez você também possa diminuir o ruído por dentro.", "Fiquemos aqui por alguns instantes."]
        ]
    };

    const RETORNO_MESMO_DIA = {
        manha: [
            "Hoje já caminhamos juntos.",
            "Leve a nossa conversa com você ao longo deste dia.",
            "Amanhã, em qualquer horário, um novo encontro estará disponível."
        ],
        tarde: [
            "Hoje já tivemos nosso encontro.",
            "Talvez alguma parte dele ainda esteja caminhando dentro de você.",
            "Amanhã, em qualquer horário, continuaremos."
        ],
        noite: [
            "Hoje já caminhamos juntos.",
            "Quando for descansar, permita que o silêncio organize o que as palavras apenas começaram.",
            "Amanhã, em qualquer horário, estarei aqui novamente."
        ],
        madrugada: [
            "Nosso encontro de hoje já aconteceu.",
            "Agora, relaxe e deixe o descanso agir.",
            "Quando um novo dia chegar, o próximo encontro estará disponível."
        ]
    };

    function escolher(lista) {
        return lista[Math.floor(Math.random() * lista.length)];
    }

    function abertura() {
        return escolher(ABERTURAS[periodoDoDia()]);
    }

    function cenaDeAbertura() {
        return {
            tipo: "texto",
            texto: abertura().join("<br><br>"),
            pausa: CONFIG.pausa.longa
        };
    }

    function retornoMesmoDia() {
        return RETORNO_MESMO_DIA[periodoDoDia()];
    }

    function mensagemJornadaConcluida() {
        const periodo = periodoDoDia();
        const finais = {
            manha: "Que o dia receba com delicadeza aquilo que você descobriu.",
            tarde: "Que o restante do dia encontre você um pouco mais consciente do próprio caminho.",
            noite: "Quando descansar, deixe que o silêncio cuide do que não precisa mais ser explicado.",
            madrugada: "Agora descanse. Algumas compreensões amadurecem enquanto dormimos."
        };

        return [
            "Chegamos ao fim deste primeiro trecho.",
            "O caminho percorrido agora também vive em você.",
            finais[periodo]
        ];
    }

    return {
        periodoDoDia,
        abertura,
        cenaDeAbertura,
        retornoMesmoDia,
        mensagemJornadaConcluida
    };

})();
