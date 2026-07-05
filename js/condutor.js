
/*
======================================================
GUARDIÃO v2.0
CONDUTOR
======================================================
Interpreta o roteiro.
Nunca desenha nada na tela.
Toda interface é responsabilidade do Palco.
======================================================
*/

const Condutor = {

    async executar(roteiro) {

        Palco.iniciar();

        for (const cena of roteiro.cenas) {

            switch (cena.tipo) {

                case "texto":
                    await this.texto(cena);
                    break;

                case "nome":
                    await this.nome(cena);
                    break;

                case "escolha":
                    await this.escolha(cena);
                    break;

                case "silencio":
                    await this.silencio(cena);
                    break;

                case "fim":
                    await this.fim(cena);
                    return;

                default:
                    console.warn("Cena desconhecida:", cena);

            }

        }

    },

    //---------------------------------------

    substituir(texto) {

        return texto.replaceAll("{nome}", MEMORIA.nome);

    },

    //---------------------------------------

    async texto(cena) {

    await Palco.mostrarTexto(

        this.substituir(cena.texto)

    );

    const pausa = cena.pausa ?? CONFIG.pausa.media;

    await Palco.esperar(pausa);

}
    //---------------------------------------

    async nome(cena) {

        MEMORIA.nome = await Palco.pedirNome(
            cena.pergunta
        );

    },

    //---------------------------------------

    async escolha(cena) {

    // Mostra apenas a pergunta
    await Palco.mostrarTexto(

        cena.pergunta

    );

    // Tempo para a pessoa ler antes dos botões
    await Palco.esperar(

        cena.pausa ?? CONFIG.pausa.media

    );

    // Agora aparecem os botões
    const resposta = await Palco.escolha(

        cena.pergunta,

        cena.positivo,

        cena.negativo

    );

    MEMORIA.escolhas.push(resposta);

}

    //---------------------------------------

    async silencio(cena) {

        Palco.limpar();

        MEMORIA.toquesNoSilencio = 0;

        const contarToque = () => {

            MEMORIA.toquesNoSilencio++;

        };

        document.addEventListener("click", contarToque);

        await Palco.esperar(cena.tempo);

        document.removeEventListener("click", contarToque);

        if (MEMORIA.toquesNoSilencio > 0) {

            Palco.mostrarTexto(
                "Percebo que a espera não é fácil."
            );

            await Palco.esperar(CONFIG.pausa.media);

            Palco.mostrarTexto(
                "Reflita mais um instante."
            );

            await Palco.esperar(CONFIG.pausa.media);

        }

    },

    //---------------------------------------

    async fim(cena) {

        Palco.mostrarTexto(
            this.substituir(cena.texto)
        );

    }

};
