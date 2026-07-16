/*
======================================================
GUARDIÃO v3.1
AGENDA DO PRÓXIMO ENCONTRO
======================================================
*/

const AgendaGuardiao = (() => {

    let relogio = null;

    function doisDigitos(valor) {
        return String(valor).padStart(2, "0");
    }

    function formatarDuracao(ms) {
        const totalSegundos = Math.max(
            0,
            Math.ceil(ms / 1000)
        );

        const horas = Math.floor(
            totalSegundos / 3600
        );

        const minutos = Math.floor(
            (totalSegundos % 3600) / 60
        );

        const segundos =
            totalSegundos % 60;

        if (horas > 0) {
            return [
                doisDigitos(horas),
                doisDigitos(minutos),
                doisDigitos(segundos)
            ].join(":");
        }

        return [
            doisDigitos(minutos),
            doisDigitos(segundos)
        ].join(":");
    }

    function formatarHorario(timestamp) {
        return new Intl.DateTimeFormat(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(new Date(timestamp));
    }

    function formatarData(timestamp) {
        return new Intl.DateTimeFormat(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(new Date(timestamp));
    }

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

        const memoria = Memoria.carregar();
        const horario =
            memoria.proximoEncontroEm;

        function desenhar() {
            const restante =
                Memoria.tempoRestante();

            if (restante <= 0) {
                pararRelogio();
                aoChegarHorario();
                return;
            }

            elemento.innerHTML = `
                <section class="tela-espera">
                    <p class="fala-guardiao">
                        Você chegou antes do nosso encontro.
                    </p>

                    <p class="fala-guardiao fala-secundaria">
                        Isso também diz algo sobre sua
                        disposição de continuar.
                    </p>

                    <p class="fala-guardiao fala-secundaria">
                        Ainda falta um pouco. Fique em paz.
                        Quando chegar a hora, estarei aqui.
                    </p>

                    <div class="horario-encontro">
                        Nosso encontro está marcado para
                        <strong>
                            ${formatarHorario(horario)}
                        </strong>.
                    </div>

                    <div
                        class="contagem-encontro"
                        aria-live="polite"
                    >
                        ${formatarDuracao(restante)}
                    </div>

                    <div class="data-encontro">
                        ${formatarData(horario)}
                    </div>
                </section>
            `;
        }

        desenhar();

        relogio = setInterval(
            desenhar,
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
                    O caminho percorrido agora também
                    vive em você.
                </p>
            </section>
        `;
    }

    return {
        mostrarEspera,
        jornadaConcluida,
        pararRelogio,
        formatarDuracao,
        formatarHorario,
        formatarData
    };

})();
