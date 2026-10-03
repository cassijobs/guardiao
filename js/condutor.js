/*
======================================================
GUARDIÃO v3.1
CONDUTOR
======================================================
Interpreta o roteiro.
O intervalo entre encontros pertence à Memoria.
======================================================
*/

const Condutor = {

    dados: null,
    opcoes: {},
    historicoTextos: [],

    async executar(roteiro, opcoes = {}) {
        this.opcoes = opcoes;
        this.dados = Memoria.carregar();
        this.historicoTextos = [];

        Palco.iniciar();

        for (const cena of roteiro.cenas) {
            const continuar =
                await this.executarCena(cena);

            if (continuar === false) {
                /*
                 * Só o "fim" que está diretamente no
                 * roteiro principal conclui o encontro.
                 *
                 * Um "fim" dentro de seNegativo apenas
                 * encerra a visita sem avançar.
                 */
                if (cena.tipo === "fim") {
                    await this.concluirEncontro();
                }

                return;
            }
        }

        /*
         * Segurança para algum roteiro sem cena "fim".
         */
        await this.concluirEncontro();
    },

    async concluirEncontro() {
        if (
            typeof this.opcoes.aoConcluir ===
            "function"
        ) {
            await this.opcoes.aoConcluir();
        }
    },

    async executarCena(cena) {
        switch (cena.tipo) {
            case "texto":
                await this.texto(cena);
                return true;

            case "jornada":
                await this.jornada(cena);
                return true;

            case "nome":
                await this.nome(cena);
                return true;

            case "escolha":
                return await this.escolha(cena);

            case "silencio":
                await this.silencio(cena);
                return true;

            case "fim":
                await this.fim(cena);
                return false;

            default:
                console.warn(
                    "Cena desconhecida:",
                    cena
                );
                return true;
        }
    },

    substituir(texto = "") {
        return String(texto).replaceAll(
            "{nome}",
            this.dados?.nome || ""
        );
    },

    async texto(cena) {
        const texto = this.substituir(cena.texto);
        await Palco.mostrarTextoNavegavel(texto, this.historicoTextos);
        this.historicoTextos.push(texto);
    },

    async jornada(cena) {
        const titulo = this.substituir(cena.titulo ?? "");
        const partes = Array.isArray(cena.texto)
            ? cena.texto.map(parte => this.substituir(parte))
            : [this.substituir(cena.texto ?? "")];
        await Palco.mostrarJornada({
            rotulo: this.substituir(
                cena.rotulo ?? "Nova Jornada"
            ),
            titulo,
            frase: this.substituir(
                cena.frase ?? ""
            ),
            texto: partes,
            botao: this.substituir(
                cena.botao ?? "Continuar"
            )
        });
        const resumo = [titulo, ...partes].filter(Boolean).join("<br><br>");
        if (resumo) this.historicoTextos.push(resumo);
    },

    async nome(cena) {
        if (
            this.dados.nome &&
            cena.pularSeExistir
        ) {
            return;
        }

        const nome = await Palco.pedirNome(
            cena.pergunta
        );

        this.dados =
            Memoria.salvarNome(nome);
    },

    async escolha(cena) {
        const pergunta = this.substituir(cena.pergunta);
        await Palco.mostrarTextoNavegavel(pergunta, this.historicoTextos);
        this.historicoTextos.push(pergunta);

        const resposta =
            await Palco.mostrarBotoes(
                this.substituir(cena.pergunta),
                cena.positivo,
                cena.negativo
            );

        this.dados =
            Memoria.registrarEscolha({
                encontro:
                    this.dados.encontroAtual,
                id: cena.id ?? "escolha",
                resposta,
                registradoEm: Date.now()
            });

        if (
            !resposta &&
            Array.isArray(cena.seNegativo)
        ) {
            for (const subCena of cena.seNegativo) {
                const continuar =
                    await this.executarCena(
                        subCena
                    );

                if (continuar === false) {
                    return false;
                }
            }

            return false;
        }

        if (
            resposta &&
            Array.isArray(cena.sePositivo)
        ) {
            for (const subCena of cena.sePositivo) {
                const continuar =
                    await this.executarCena(
                        subCena
                    );

                if (continuar === false) {
                    return false;
                }
            }
        }

        return true;
    },

    async silencio(cena) {
        Palco.limpar();

        let toques = 0;

        const contarToque = () => {
            toques++;
        };

        document.addEventListener(
            "click",
            contarToque
        );

        document.addEventListener(
            "touchstart",
            contarToque
        );

        try {
            await Palco.esperar(
                cena.tempo ??
                CONFIG.pausa.silencio
            );
        } finally {
            document.removeEventListener(
                "click",
                contarToque
            );

            document.removeEventListener(
                "touchstart",
                contarToque
            );
        }

        this.dados =
            Memoria.definirToquesNoSilencio(
                toques
            );

        if (toques > 0) {
            await Palco.mostrarTexto(
                "Percebo que a espera não é fácil."
            );

            await Palco.esperar(
                CONFIG.pausa.media
            );

            await Palco.mostrarTexto(
                "Reflita mais um instante."
            );

            await Palco.esperar(
                CONFIG.pausa.media
            );
        }
    },

    async fim(cena) {
        const texto = this.substituir(cena.texto);
        await Palco.mostrarTextoNavegavel(texto, this.historicoTextos);
        this.historicoTextos.push(texto);
        if (typeof this.opcoes.aoPrepararRevisao === "function") {
            await this.opcoes.aoPrepararRevisao([...this.historicoTextos]);
        }
        await Palco.mostrarEncerramento(this.historicoTextos);
    }

};
