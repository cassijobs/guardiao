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

    function mostrarEspera(
        elemento,
        aoChegarHorario
    ) {

        pararRelogio();

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
                    Você chegou antes do nosso encontro.
                </p>

                <p class="fala-guardiao fala-secundaria">
                    Isso também diz algo sobre sua disposição de continuar.
                </p>

                <p class="fala-guardiao fala-secundaria">
                    Ainda falta um pouco.
                    Fique em paz.
                    Quando chegar a hora, estarei aqui.
                </p>

            </section>
        `;

        /*
         * O tempo continua sendo verificado,
         * mas não aparece na tela.
         */
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
