/*
======================================================
GUARDIÃO v2.0
PALCO
======================================================
Único responsável por desenhar na tela.
Não conhece o roteiro.
Não toma decisões.
======================================================
*/

const Palco = {

    elemento: null,

    iniciar() {

        this.elemento = document.getElementById("guardiao");

    },

    limpar() {

        this.elemento.innerHTML = "";

    },

    mostrarTexto(texto) {

        this.elemento.innerHTML = `
            <div class="visivel">
                ${texto}
            </div>
        `;

    },

    pedirNome(pergunta) {

        return new Promise(resolve => {

            this.elemento.innerHTML = `

                <div class="pergunta">
                    ${pergunta}
                </div>

                <input
                    id="nome"
                    placeholder="Digite seu nome"
                    autocomplete="off"
                    autofocus
                >

                <button class="botao" id="confirmar">
                    Continuar
                </button>

            `;

            const input = document.getElementById("nome");
            const botao = document.getElementById("confirmar");

            function confirmar() {

                const nome = input.value.trim();

                if(nome.length===0){

                    input.focus();
                    return;

                }

                resolve(nome);

            }

            botao.addEventListener("click", confirmar);

            input.addEventListener("keydown", e=>{

                if(e.key==="Enter"){

                    confirmar();

                }

            });

            input.focus();

        });

    },

    escolha(pergunta, positivo, negativo){

        return new Promise(resolve=>{

            this.elemento.innerHTML=`

                <div class="pergunta">

                    ${pergunta}

                </div>

                <button class="botao" id="sim">

                    ${positivo}

                </button>

                <button class="botao" id="nao">

                    ${negativo}

                </button>

            `;

            document
                .getElementById("sim")
                .onclick=()=>resolve(true);

            document
                .getElementById("nao")
                .onclick=()=>resolve(false);

        });

    },

    esperar(ms){

        return new Promise(resolve=>setTimeout(resolve,ms));

    }

};