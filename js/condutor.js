/*
======================================================
GUARDIÃO v3.0
CONDUTOR
======================================================
Interpreta o roteiro.
Não controla o avanço diário.
======================================================
*/

const Condutor = {

    async executar(roteiro) {

        Palco.iniciar();

        for (const cena of roteiro.cenas) {

            const continuar = await this.executarCena(cena);

            if (continuar === false) {
                return;
            }

        }

    },

    async executarCena(cena) {

        switch (cena.tipo) {

            case "texto":
                await this.texto(cena);
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
                console.warn("Cena desconhecida:", cena);
                return true;

        }

    },

    substituir(texto) {

        return texto.replaceAll(
            "{nome}",
            MEMORIA.nome || ""
        );

    },

    async texto(cena) {

        await Palco.mostrarTexto(
            this.substituir(cena.texto)
        );

        const pausa =
            cena.pausa ?? CONFIG.pausa.media;

        await Palco.esperar(pausa);

    },

    async nome(cena) {

        if (MEMORIA.nome && cena.pularSeExistir) {
            return;
        }

        MEMORIA.nome = await Palco.pedirNome(
            cena.pergunta
        );

        MEMORIA.salvar();

    },

    async escolha(cena) {

        await Palco.mostrarTexto(
            this.substituir(cena.pergunta)
        );

        await Palco.esperar(
            cena.pausa ?? CONFIG.pausa.leitura
        );

        const resposta = await Palco.mostrarBotoes(
            this.substituir(cena.pergunta),
            cena.positivo,
            cena.negativo
        );

        MEMORIA.escolhas.push({
            id: cena.id ?? "escolha",
            resposta
        });

        MEMORIA.salvar();

        if (!resposta && Array.isArray(cena.seNegativo)) {

            for (const subCena of cena.seNegativo) {

                const continuar =
                    await this.executarCena(subCena);

                if (continuar === false) {
                    return false;
                }

            }

            return false;

        }

        if (resposta && Array.isArray(cena.sePositivo)) {

            for (const subCena of cena.sePositivo) {

                const continuar =
                    await this.executarCena(subCena);

                if (continuar === false) {
                    return false;
                }

            }

        }

        return true;

    },

    async silencio(cena) {

        Palco.limpar();

        MEMORIA.toquesNoSilencio = 0;

        const contarToque = () => {
            MEMORIA.toquesNoSilencio++;
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
            cena.tempo ?? CONFIG.pausa.silencio
        );

        document.removeEventListener(
            "click",
            contarToque
        );

        document.removeEventListener(
            "touchstart",
            contarToque
        );

        if (MEMORIA.toquesNoSilencio > 0) {

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

        await Palco.mostrarTexto(
            this.substituir(cena.texto)
        );

    }

};
