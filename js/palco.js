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

    escapar(valor) {
        return String(valor ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
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

    pedirReflexao({ nome = "", pergunta = "", resposta = "" } = {}) {
        this.garantirElemento();
        const nomeLimpo = String(nome || "").trim();
        const chamada = nomeLimpo
            ? `${this.escapar(nomeLimpo)}, o que este encontro despertou em você hoje?`
            : "O que este encontro despertou em você hoje?";
        const perguntaFinal = String(pergunta || "").trim() || chamada;

        return new Promise(resolve => {
            this.elemento.innerHTML = `
                <section class="reflexao-guardiao">
                    <p class="rotulo-reflexao">MINHA REFLEXÃO</p>
                    <h2>${this.escapar(perguntaFinal)}</h2>
                    <p class="orientacao-reflexao">Não procure uma resposta perfeita. Escreva apenas o que é verdadeiro agora.</p>
                    <label class="sr" for="resposta-reflexao">Sua reflexão</label>
                    <textarea id="resposta-reflexao" maxlength="6000" placeholder="Escreva aqui, se desejar.">${this.escapar(resposta)}</textarea>
                    <p id="estado-reflexao" class="estado-reflexao" role="status" aria-live="polite"></p>
                    <button class="botao" id="guardar-reflexao" type="button">Guardar minha reflexão</button>
                    <button class="botao botao-secundario" id="seguir-sem-escrever" type="button">Hoje prefiro apenas refletir</button>
                </section>`;
            this.elemento.classList.remove("oculto");
            this.elemento.classList.add("visivel");

            const campo = document.getElementById("resposta-reflexao");
            const estado = document.getElementById("estado-reflexao");
            document.getElementById("guardar-reflexao").onclick = () => {
                const valor = campo.value.trim();
                if (!valor) {
                    estado.textContent = "Escreva algo ou escolha continuar sem escrever.";
                    campo.focus();
                    return;
                }
                resolve({ resposta: valor, pergunta: perguntaFinal });
            };
            document.getElementById("seguir-sem-escrever").onclick = () => resolve(null);
            campo.focus();
        });
    },

    mostrarMinhasReflexoes(reflexoes = []) {
        this.garantirElemento();
        const registros = Array.isArray(reflexoes) ? [...reflexoes].reverse() : [];
        const conteudo = registros.length
            ? registros.map(registro => {
                const data = new Date(Number(registro.registradoEm) || Date.now()).toLocaleDateString("pt-BR");
                return `
                    <article class="cartao-reflexao">
                        <p class="meta-reflexao">ENCONTRO ${Number(registro.encontroNumero) || ""} · ${this.escapar(data)}</p>
                        <h3>${this.escapar(registro.titulo || "Encontro")}</h3>
                        <p class="pergunta-guardada">${this.escapar(registro.pergunta || "")}</p>
                        <p class="resposta-guardada">${this.escapar(registro.resposta || "")}</p>
                    </article>`;
            }).join("")
            : '<p class="reflexoes-vazias">Quando você guardar uma reflexão, ela aparecerá aqui.</p>';

        return new Promise(resolve => {
            this.elemento.innerHTML = `
                <section class="minhas-reflexoes">
                    <p class="rotulo-reflexao">MEU CAMINHO</p>
                    <h2>Minhas Reflexões</h2>
                    <p class="orientacao-reflexao">Palavras que você escolheu guardar durante seus encontros.</p>
                    <div class="lista-reflexoes">${conteudo}</div>
                    <button class="botao" id="voltar-das-reflexoes" type="button">Voltar</button>
                </section>`;
            this.elemento.classList.remove("oculto");
            this.elemento.classList.add("visivel");
            document.getElementById("voltar-das-reflexoes").onclick = resolve;
        });
    },

    mostrarEncerramento(textos = [], nome = "") {
        this.garantirElemento();
        return new Promise(resolve => {
            const desenhar = () => {
                this.elemento.innerHTML = `
                    <section class="tela-espera encerramento-encontro">
                        <p class="fala-guardiao">Por hoje, guarde consigo o que encontrou.</p>
                        <p class="fala-guardiao fala-secundaria">Amanhã continuamos${nome ? `, ${this.escapar(nome)}` : ""}.</p>
                        <button class="botao" id="rever-encontro-agora" type="button">Rever este encontro</button>
                        <button class="botao" id="minhas-reflexoes-agora" type="button">Minhas Reflexões</button>
                        <button class="botao botao-secundario" id="encerrar-encontro" type="button">Encerrar por hoje</button>
                    </section>`;
                document.getElementById("rever-encontro-agora").onclick = async () => {
                    await this.reverTextos(textos);
                    desenhar();
                };
                document.getElementById("minhas-reflexoes-agora").onclick = async () => {
                    await this.mostrarMinhasReflexoes(Memoria.carregar().reflexoes);
                    desenhar();
                };
                document.getElementById("encerrar-encontro").onclick = evento => {
                    evento.currentTarget.disabled = true;
                    evento.currentTarget.textContent = "Guardando seu encontro...";
                    resolve("encerrar");
                };
            };
            desenhar();
        });
    },

    finalizarEncerramento() {
        this.garantirElemento();

        // Só é chamado depois que o progresso foi enviado ao Supabase.
        window.close();
        window.setTimeout(() => {
            this.elemento.innerHTML = `
                <section class="tela-espera encerramento-encontro encerramento-final">
                    <p class="fala-guardiao">Encontro encerrado.</p>
                    <p class="fala-guardiao fala-secundaria">Seu caminho foi guardado. Você já pode fechar esta página.</p>
                </section>`;
            this.elemento.classList.remove("oculto");
            this.elemento.classList.add("visivel");
        }, 200);
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
