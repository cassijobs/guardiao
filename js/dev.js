/*
======================================================
GUARDIÃO v3.8
MODO DESENVOLVEDOR
======================================================
Ativação:
https://cassijobs.github.io/guardiao/?dev
======================================================
*/

/*
 * Esta verificação precisa acontecer imediatamente,
 * antes do carregamento do script.js.
 */
const parametrosDev =
    new URLSearchParams(
        window.location.search
    );

window.GUARDIAO_MODO_DEV =
    parametrosDev.has("dev");


const DEV = {

    ativo: window.GUARDIAO_MODO_DEV,


    iniciar() {

        if (!this.ativo) {
            return;
        }

        this.mostrarPainel();

    },


    mostrarPainel() {

        const elemento =
            document.getElementById(
                "guardiao"
            );

        if (!elemento) {
            return;
        }

        if (
            typeof AgendaGuardiao !==
            "undefined"
        ) {
            AgendaGuardiao.pararRelogio();
        }

        elemento.classList.remove(
            "oculto"
        );

        elemento.classList.add(
            "visivel"
        );

        elemento.innerHTML = `
            <section class="tela-espera">

                <p class="fala-guardiao">
                    Ferramentas do Guardião
                </p>

                <button
                    class="botao"
                    onclick="DEV.resetar()"
                >
                    Reiniciar caminhada
                </button>

                <button
                    class="botao"
                    onclick="DEV.liberarAgora()"
                >
                    Liberar encontro
                </button>

                <button
                    class="botao"
                    onclick="DEV.irParaEncontro()"
                >
                    Ir para encontro
                </button>

                <button
                    class="botao"
                    onclick="DEV.sair()"
                >
                    Sair das ferramentas
                </button>

            </section>
        `;

    },


    resetar() {

        Memoria.resetar();

        this.abrirNormal();

    },


    liberarAgora() {

        Memoria.liberarAgora();

        this.abrirNormal();

    },


    irParaEncontro() {

        const numero = prompt(
            "Digite o número do encontro:"
        );

        if (!numero) {
            return;
        }

        Memoria.irParaEncontro(
            numero
        );

        this.abrirNormal();

    },


    mostrarMemoria() {

        const dados =
            Memoria.carregar();

        console.table(dados);

        return dados;

    },


    sair() {

        this.abrirNormal();

    },


    abrirNormal() {

        window.location.replace(
            window.location.pathname
        );

    }

};


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => DEV.iniciar()
    );

} else {

    DEV.iniciar();

}
