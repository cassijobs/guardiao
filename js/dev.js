/*
======================================================
GUARDIÃO v3.3
MODO DESENVOLVEDOR
======================================================
Ativação:
https://cassijobs.github.io/guardiao/?dev
======================================================
*/

const DEV = {

    ativo: false,

    iniciar() {

        const parametros =
            new URLSearchParams(
                window.location.search
            );

        if (parametros.has("dev")) {

            this.ativo = true;

            localStorage.setItem(
                "guardiao_modo_dev",
                "true"
            );

            this.mostrarPainel();

            return;

        }

        this.ativo =
            localStorage.getItem(
                "guardiao_modo_dev"
            ) === "true";

    },

    mostrarPainel() {

        const elemento =
            document.getElementById(
                "guardiao"
            );

        if (!elemento) {
            return;
        }

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

        window.location.href =
            window.location.pathname;

    },

    liberarAgora() {

        Memoria.liberarAgora();

        window.location.href =
            window.location.pathname;

    },

    irParaEncontro() {

        const numero = prompt(
            "Digite o número do encontro:"
        );

        if (!numero) {
            return;
        }

        Memoria.irParaEncontro(numero);

        window.location.href =
            window.location.pathname;

    },

    mostrarMemoria() {

        const dados =
            Memoria.carregar();

        console.table(dados);

        return dados;

    },

    sair() {

        localStorage.removeItem(
            "guardiao_modo_dev"
        );

        window.location.href =
            window.location.pathname;

    }

};

document.addEventListener(
    "DOMContentLoaded",
    () => DEV.iniciar()
);
