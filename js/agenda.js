/*
======================================================
GUARDIÃO v3.2
AGENDA DO PRÓXIMO ENCONTRO
======================================================
O horário continua sendo controlado internamente,
mas não é exibido ao usuário.
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

    function escolherMensagem(
        visitasAntecipadas
    ) {

        if (visitasAntecipadas === 1) {
            return [
                "Você chegou antes do nosso encontro.",
                "Gosto da sua disposição em continuar.",
                "Estarei aqui."
            ];
        }

        if (visitasAntecipadas === 2) {
            return [
                "Vejo que voltou mais cedo outra vez.",
                "Talvez nossa caminhada já esteja encontrando um lugar no seu dia.",
                "Estarei aqui."
            ];
        }

        if (visitasAntecipadas === 3) {
            return [
                "Começo a perceber um pequeno costume seu.",
                "Você gosta de chegar antes.",
                "Estarei aqui."
            ];
        }

        if (visitasAntecipadas === 5) {
            return [
                "É curioso...",
                "Algumas pessoas evitam os encontros. Você costuma antecipá-los.",
                "Estarei aqui."
            ];
        }

        if (visitasAntecipadas === 10) {
            return [
                "Acho que já conheço um pouco você.",
                "Chegar cedo parece fazer parte do seu jeito.",
                "Estarei aqui."
            ];
        }

        const mensagens = [
            [
                "Nem toda espera é tempo perdido.",
                "Às vezes ela também faz parte da caminhada.",
                "Estarei aqui."
            ],
            [
                "A caminhada continua.",
                "Mas cada passo tem o seu próprio momento.",
                "Estarei aqui."
            ],
            [
                "Percebo sua vontade de continuar.",
                "Isso me alegra.",
                "Estarei aqui."
            ],
            [
                "Há encontros que amadurecem enquanto esperamos.",
                "Talvez este seja um deles.",
                "Estarei aqui."
            ],
            [
                "Você voltou.",
                "Ainda não chegou a hora da nossa conversa.",
                "Estarei aqui."
            ]
        ];

        return mensagens[
            Math.floor(
                Math.random() *
                mensagens.length
            )
        ];

    }

    function mostrarEspera(
        elemento,
        aoChegarHorario,
        visitasAntecipadas
    ) {

        pararRelogio();

        const mensagem =
            escolherMensagem(
                visitasAntecipadas
            );

        function verificarHorario() {

            const restante =
                Memoria.tempoRestante();

            if (restante <= 0) {
                pararRelogio();
                aoChegarHorario();
            }

        }

        elemento.innerHTML = `
            <section class="tela-espera">

                <p class="fala-guardiao">
                    ${mensagem[0]}
                </p>

                <p class="fala-guardiao fala-secundaria">
                    ${mensagem[1]}
                </p>

                <p class="fala-guardiao fala-secundaria">
                    ${mensagem[2]}
                </p>

            </section>
        `;

        verificarHorario();

        relogio = setInterval(
            verificarHorario,
            1000
        );

    }

    function jornadaConcluida(elemento) {

        pararRelogio();

        elemento.innerHTML = `
            <section class="tela-espera">

                <p class="fala-guardiao">
                    Chegamos ao fim deste primeiro trecho.
                </p>

                <p class="fala-guardiao fala-secundaria">
                    O caminho percorrido agora também vive em você.
                </p>

            </section>
        `;

    }

    return {
        mostrarEspera,
        jornadaConcluida,
        pararRelogio
    };

})();
