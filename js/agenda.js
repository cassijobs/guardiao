/*
======================================================
GUARDIÃO v4.0
AGENDA DIÁRIA
======================================================
Controla apenas a disponibilidade dos encontros.
A voz e as mensagens ficam em saudacao.js.
Regra: um encontro por dia do calendário do aparelho.
======================================================
*/

const AgendaGuardiao = (() => {

    let relogio = null;

    function pararRelogio() {
        if (relogio) {
            clearInterval(relogio);
            relogio = null;
        }
    }

    function mensagemDeEspera(visitasAntecipadas) {
        if (visitasAntecipadas === 1) {
            return "Gosto de perceber sua disposição em continuar.";
        }

        if (visitasAntecipadas === 2) {
            return "Talvez nossa caminhada já esteja encontrando um lugar no seu dia.";
        }

        if (visitasAntecipadas >= 5) {
            return "Sua vontade de continuar já começa a parecer um pequeno hábito.";
        }

        const mensagens = [
            "Algumas respostas continuam trabalhando mesmo quando não estamos falando.",
            "Cada encontro precisa de um pouco de vida entre uma conversa e outra.",
            "Percebo sua vontade de continuar. Isso me alegra.",
            "Há encontros que amadurecem enquanto seguimos o dia."
        ];

        return mensagens[Math.floor(Math.random() * mensagens.length)];
    }

    function mostrarEspera(elemento, aoMudarODia, visitasAntecipadas = 0) {
        pararRelogio();

        const mensagens = SaudacaoGuardiao.retornoMesmoDia();
        const observacao = mensagemDeEspera(visitasAntecipadas);

        elemento.innerHTML = `
            <section class="tela-espera">
                <p class="fala-guardiao">${mensagens[0]}</p>
                <p class="fala-guardiao fala-secundaria">${observacao}</p>
                <p class="fala-guardiao fala-secundaria">${mensagens[1]}</p>
                <p class="fala-guardiao fala-secundaria">${mensagens[2]}</p>
            </section>
        `;

        function verificarMudancaDoDia() {
            if (Memoria.podeIniciarAgora()) {
                pararRelogio();
                aoMudarODia();
            }
        }

        verificarMudancaDoDia();
        relogio = setInterval(verificarMudancaDoDia, 30000);
    }

    function jornadaConcluida(elemento) {
        pararRelogio();
        const mensagens = SaudacaoGuardiao.mensagemJornadaConcluida();

        elemento.innerHTML = `
            <section class="tela-espera">
                ${mensagens.map((texto, indice) => `
                    <p class="fala-guardiao${indice ? " fala-secundaria" : ""}">
                        ${texto}
                    </p>
                `).join("")}
            </section>
        `;
    }

    return {
        mostrarEspera,
        jornadaConcluida,
        pararRelogio
    };

})();
