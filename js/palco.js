/*
======================================================
GUARDIÃO v3.1
PALCO
======================================================
Único responsável por desenhar na tela.
======================================================
*/

const Palco = {
    elemento: null,

    iniciar() {
        this.elemento =
            document.getElementById("guardiao");

        if (!this.elemento) {
            throw new Error(
                "Elemento #guardiao não encontrado."
            );
        }
    },

    garantirElemento() {
        if (!this.elemento) {
            this.iniciar();
        }
    },

    limpar() {
        this.garantirElemento();
        this.elemento.innerHTML = "";
    },

    esperar(ms) {
        return new Promise(
            resolve => setTimeout(resolve, ms)
        );
    },

    mostrarTexto(texto) {
        this.garantirElemento();

        return new Promise(resolve => {
            this.elemento.classList.remove(
                "visivel"
            );

            this.elemento.classList.add(
                "oculto"
            );

            setTimeout(() => {
                this.elemento.innerHTML =
                    `<div>${texto}</div>`;

                this.elemento.classList.remove(
                    "oculto"
                );

                this.elemento.classList.add(
                    "visivel"
                );

                resolve();
            }, CONFIG.fade);
        });
    },

    pedirNome(pergunta) {
        this.garantirElemento();

        return new Promise(resolve => {
            this.elemento.innerHTML = `
                <div class="pergunta">
                    ${pergunta}
                </div>

                <input
                    id="nome"
                    placeholder="Digite seu nome"
                    autocomplete="off"
                >

                <button
                    class="botao"
                    id="confirmar"
                >
                    Continuar
                </button>
            `;

            this.elemento.classList.remove(
                "oculto"
            );

            this.elemento.classList.add(
                "visivel"
            );

            const input =
                document.getElementById("nome");

            const botao =
                document.getElementById(
                    "confirmar"
                );

            function confirmar() {
                const nome = input.value.trim();

                if (!nome) {
                    input.focus();
                    return;
                }

                resolve(nome);
            }

            botao.addEventListener(
                "click",
                confirmar
            );

            input.addEventListener(
                "keydown",
                evento => {
                    if (evento.key === "Enter") {
                        confirmar();
                    }
                }
            );

            input.focus();
        });
    },

    mostrarBotoes(
        pergunta,
        positivo,
        negativo
    ) {
        this.garantirElemento();

        return new Promise(resolve => {
            this.elemento.innerHTML = `
                <div class="pergunta">
                    ${pergunta}
                </div>

                <div id="areaBotoes">
                    <button
                        class="botao oculto"
                        id="sim"
                    >
                        ${positivo}
                    </button>

                    <button
                        class="botao oculto"
                        id="nao"
                    >
                        ${negativo}
                    </button>
                </div>
            `;

            this.elemento.classList.remove(
                "oculto"
            );

            this.elemento.classList.add(
                "visivel"
            );

            const btnSim =
                document.getElementById("sim");

            const btnNao =
                document.getElementById("nao");

            setTimeout(() => {
                btnSim.classList.remove("oculto");
                btnSim.classList.add("visivel");
            }, 200);

            setTimeout(() => {
                btnNao.classList.remove("oculto");
                btnNao.classList.add("visivel");
            }, 700);

            btnSim.onclick = () => resolve(true);
            btnNao.onclick = () => resolve(false);
        });
    }
};
