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
    const tempo = window.GUARDIAO_MODO_RAPIDO
        ? Math.min(ms, 150)
        : ms;

    return new Promise(
        resolve => setTimeout(resolve, tempo)
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

    mostrarTextoNavegavel(texto, anteriores = []) {
        this.garantirElemento();
        const telas = [...anteriores, texto];
        let indice = telas.length - 1;

        return new Promise(resolve => {
            const desenhar = () => {
                const atual = indice === telas.length - 1;
                this.elemento.innerHTML = `
                    <section class="leitura-guardiao">
                        <div class="texto-leitura">${telas[indice]}</div>
                        <nav class="navegacao-leitura" aria-label="Navegação da reflexão">
                            <button class="botao botao-voltar" type="button" ${indice === 0 ? "disabled" : ""}>← Voltar</button>
                            <button class="botao botao-avancar" type="button">${atual ? "Avançar →" : "Próxima →"}</button>
                        </nav>
                    </section>`;
                this.elemento.classList.remove("oculto");
                this.elemento.classList.add("visivel");
                this.elemento.querySelector(".botao-voltar").onclick = () => { indice--; desenhar(); };
                this.elemento.querySelector(".botao-avancar").onclick = () => {
                    if (indice < telas.length - 1) { indice++; desenhar(); }
                    else resolve();
                };
            };
            desenhar();
        });
    },

    reverTextos(textos = []) {
        this.garantirElemento();
        const telas = textos.filter(Boolean);
        if (!telas.length) return Promise.resolve();
        let indice = 0;

        return new Promise(resolve => {
            const desenhar = () => {
                this.elemento.innerHTML = `
                    <section class="leitura-guardiao revisao-guardiao">
                        <p class="rotulo-revisao">REVENDO SEU ÚLTIMO ENCONTRO</p>
                        <div class="texto-leitura">${telas[indice]}</div>
                        <nav class="navegacao-leitura" aria-label="Navegação da revisão">
                            <button class="botao botao-voltar" type="button" ${indice === 0 ? "disabled" : ""}>← Voltar</button>
                            <button class="botao botao-avancar" type="button">${indice === telas.length - 1 ? "Concluir" : "Próxima →"}</button>
                        </nav>
                    </section>`;
                this.elemento.querySelector(".botao-voltar").onclick = () => { indice--; desenhar(); };
                this.elemento.querySelector(".botao-avancar").onclick = () => {
                    if (indice < telas.length - 1) { indice++; desenhar(); }
                    else resolve();
                };
            };
            desenhar();
        });
    },

    mostrarEncerramento(textos = []) {
        this.garantirElemento();
        return new Promise(resolve => {
            const desenhar = () => {
                this.elemento.innerHTML = `
                    <section class="tela-espera encerramento-encontro">
                        <p class="fala-guardiao">Por hoje, guarde consigo o que encontrou.</p>
                        <p class="fala-guardiao fala-secundaria">Amanhã continuamos.</p>
                        <button class="botao" id="rever-encontro-agora" type="button">Rever este encontro</button>
                        <button class="botao botao-secundario" id="encerrar-encontro" type="button">Encerrar por hoje</button>
                    </section>`;
                document.getElementById("rever-encontro-agora").onclick = async () => {
                    await this.reverTextos(textos);
                    desenhar();
                };
                document.getElementById("encerrar-encontro").onclick = () => {
                    resolve();

                    // Navegadores só permitem fechar automaticamente abas abertas
                    // por script. Tentamos fechar e, quando isso é bloqueado, encerramos
                    // a experiência nesta própria página sem reiniciar o encontro.
                    window.close();
                    window.setTimeout(() => {
                        this.elemento.innerHTML = `
                            <section class="tela-espera encerramento-encontro encerramento-final">
                                <p class="fala-guardiao">Encontro encerrado.</p>
                                <p class="fala-guardiao fala-secundaria">Você já pode fechar esta página.</p>
                            </section>`;
                        this.elemento.classList.remove("oculto");
                        this.elemento.classList.add("visivel");
                    }, 200);
                };
            };
            desenhar();
        });
    },

    mostrarJornada({
        rotulo = "Nova Jornada",
        titulo = "",
        frase = "",
        texto = [],
        botao = "Continuar"
    } = {}) {
        this.garantirElemento();

        const fraseJornada = String(frase ?? "").trim();

        const paragrafos = (Array.isArray(texto)
            ? texto
            : [texto])
            .filter(parte => parte !== null && parte !== undefined)
            .map(parte => String(parte).trim())
            .filter(Boolean)
            .map(parte => `<p>${parte}</p>`)
            .join("");

        return new Promise(resolve => {
            this.elemento.classList.remove(
                "visivel"
            );

            this.elemento.classList.add(
                "oculto"
            );

            setTimeout(() => {
                this.elemento.innerHTML = `
                    <section class="abertura-jornada">
                        <div class="rotulo-jornada">
                            ${rotulo}
                        </div>

                        <h1 class="titulo-jornada">
                            ${titulo}
                        </h1>

                        ${fraseJornada ? `
                            <blockquote class="frase-jornada">
                                ${fraseJornada}
                            </blockquote>
                        ` : ""}

                        <div class="texto-jornada">
                            ${paragrafos}
                        </div>

                        <button
                            class="botao botao-jornada"
                            id="continuar-jornada"
                            type="button"
                        >
                            ${botao}
                        </button>
                    </section>
                `;

                this.elemento.classList.remove(
                    "oculto"
                );

                this.elemento.classList.add(
                    "visivel"
                );

                const continuar =
                    document.getElementById(
                        "continuar-jornada"
                    );

                continuar.addEventListener(
                    "click",
                    resolve,
                    { once: true }
                );

                continuar.focus();
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
