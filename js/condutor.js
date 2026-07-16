/*
======================================================
GUARDIÃO v3.1
CONDUTOR
======================================================
Interpreta o roteiro.

Não controla diretamente o avanço diário.

Ao terminar o encontro principal, comunica ao sistema
por meio da função:

opcoes.aoConcluir()
======================================================
*/

const Condutor = {

    /*
    ==================================================
    EXECUTAR ENCONTRO
    ==================================================
    */

    async executar(roteiro, opcoes = {}) {

        Palco.iniciar();

        for (const cena of roteiro.cenas) {

            const continuar = await this.executarCena(
                cena,
                opcoes
            );

            /*
             * Uma cena "fim" no roteiro principal
             * representa a conclusão verdadeira do encontro.
             */
            if (continuar === false) {

                if (cena.tipo === "fim") {

                    await this.concluirEncontro(
                        opcoes
                    );

                }

                return;

            }

        }

        /*
         * Segurança para roteiros que eventualmente
         * não possuam uma cena do tipo "fim".
         */
        await this.concluirEncontro(
            opcoes
        );

    },


    /*
    ==================================================
    CONCLUSÃO DO ENCONTRO
    ==================================================
    */

    async concluirEncontro(opcoes = {}) {

        if (
            typeof opcoes.aoConcluir === "function"
        ) {

            await opcoes.aoConcluir();

        }

    },


    /*
    ==================================================
    EXECUTAR CENA
    ==================================================
    */

    async executarCena(cena, opcoes = {}) {

        switch (cena.tipo) {

            case "texto":

                await this.texto(cena);
                return true;


            case "nome":

                await this.nome(cena);
                return true;


            case "escolha":

                return await this.escolha(
                    cena,
                    opcoes
                );


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


    /*
    ==================================================
    SUBSTITUIR VARIÁVEIS
    ==================================================
    */

    substituir(texto) {

        return texto.replaceAll(
            "{nome}",
            Memoria.nome || ""
        );

    },


    /*
    ==================================================
    TEXTO
    ==================================================
    */

    async texto(cena) {

        await Palco.mostrarTexto(
            this.substituir(cena.texto)
        );

        const pausa =
            cena.pausa ?? CONFIG.pausa.media;

        await Palco.esperar(pausa);

    },


    /*
    ==================================================
    NOME
    ==================================================
    */

    async nome(cena) {

        if (
            Memoria.nome &&
            cena.pularSeExistir
        ) {
            return;
        }

        Memoria.nome = await Palco.pedirNome(
            cena.pergunta
        );

        Memoria.salvar();

    },


    /*
    ==================================================
    ESCOLHA
    ==================================================
    */

    async escolha(cena, opcoes = {}) {

        await Palco.mostrarTexto(
            this.substituir(cena.pergunta)
        );

        await Palco.esperar(
            cena.pausa ??
            CONFIG.pausa.leitura
        );

        const resposta =
            await Palco.mostrarBotoes(
                this.substituir(cena.pergunta),
                cena.positivo,
                cena.negativo
            );

        Memoria.escolhas.push({
            id: cena.id ?? "escolha",
            resposta
        });

        Memoria.salvar();


        /*
        ==============================================
        RESPOSTA NEGATIVA
        ==============================================
        */

        if (
            !resposta &&
            Array.isArray(cena.seNegativo)
        ) {

            for (
                const subCena of cena.seNegativo
            ) {

                const continuar =
                    await this.executarCena(
                        subCena,
                        opcoes
                    );

                if (continuar === false) {
                    return false;
                }

            }

            /*
             * Uma resposta negativa interrompe o
             * encontro, mas não o considera concluído.
             */
            return false;

        }


        /*
        ==============================================
        RESPOSTA POSITIVA
        ==============================================
        */

        if (
            resposta &&
            Array.isArray(cena.sePositivo)
        ) {

            for (
                const subCena of cena.sePositivo
            ) {

                const continuar =
                    await this.executarCena(
                        subCena,
                        opcoes
                    );

                if (continuar === false) {
                    return false;
                }

            }

        }

        return true;

    },


    /*
    ==================================================
    SILÊNCIO
    ==================================================
    */

    async silencio(cena) {

        Palco.limpar();

        Memoria.toquesNoSilencio = 0;

        const contarToque = () => {

            Memoria.toquesNoSilencio++;

        };

        document.addEventListener(
            "click",
            contarToque
        );

        document.addEventListener(
            "touchstart",
            contarToque
        );

        await Palco.esperar(
            cena.tempo ??
            CONFIG.pausa.silencio
        );

        document.removeEventListener(
            "click",
            contarToque
        );

        document.removeEventListener(
            "touchstart",
            contarToque
        );

        if (
            Memoria.toquesNoSilencio > 0
        ) {

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


    /*
    ==================================================
    FIM
    ==================================================
    */

    async fim(cena) {

        await Palco.mostrarTexto(
            this.substituir(cena.texto)
        );

    }

};
