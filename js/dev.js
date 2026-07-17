/*
======================================================
GUARDIÃO v4.1
FERRAMENTAS DO DESENVOLVEDOR
======================================================

Abra o site acrescentando:

?dev

Exemplo:
https://seusite.github.io/guardiao/?dev
======================================================
*/

window.GUARDIAO_DEV_ATIVO = false;

const FerramentasDev = (() => {

    function modoDevSolicitado() {

        const parametros =
            new URLSearchParams(
                window.location.search
            );

        return parametros.has("dev");

    }

    function obterAreaPrincipal() {

        let guardiao =
            document.getElementById("guardiao");

        if (guardiao) {
            return guardiao;
        }

        const app =
            document.getElementById("app");

        if (!app) {
            throw new Error(
                "Não foi encontrado #guardiao nem #app."
            );
        }

        guardiao =
            document.createElement("main");

        guardiao.id = "guardiao";

        app.innerHTML = "";
        app.appendChild(guardiao);

        return guardiao;

    }

    function obterEncontros() {

        const jornadas = [];

        if (
            typeof JORNADA1 !== "undefined" &&
            Array.isArray(JORNADA1)
        ) {
            jornadas.push(JORNADA1);
        }

        if (
            typeof JORNADA2 !== "undefined" &&
            Array.isArray(JORNADA2)
        ) {
            jornadas.push(JORNADA2);
        }

        if (
            typeof JORNADA3 !== "undefined" &&
            Array.isArray(JORNADA3)
        ) {
            jornadas.push(JORNADA3);
        }

        if (
            typeof JORNADA4 !== "undefined" &&
            Array.isArray(JORNADA4)
        ) {
            jornadas.push(JORNADA4);
        }

        return jornadas.flat();

    }

    function abrirEncontro(numero) {

        const encontros =
            obterEncontros();

        const indice =
            Number.parseInt(numero, 10) - 1;

        if (
            !Number.isInteger(indice) ||
            indice < 0 ||
            indice >= encontros.length
        ) {

            alert(
                `O encontro ${numero} ainda não existe. ` +
                `Atualmente há ${encontros.length} encontro(s) carregado(s).`
            );

            return;

        }

        Memoria.atualizar({
            encontroAtual: indice,
            proximoEncontroEm: 0,
            encontroEmAndamento: false
        });

        const endereco =
            new URL(window.location.href);

        endereco.searchParams.delete("dev");

        window.location.replace(
            endereco.toString()
        );

    }

    function reiniciarJornada1() {

        Memoria.resetar();

        const endereco =
            new URL(window.location.href);

        endereco.searchParams.delete("dev");

        window.location.replace(
            endereco.toString()
        );

    }

    function limparMemoria() {

        const confirmou =
            window.confirm(
                "Apagar o nome e todo o progresso salvo?"
            );

        if (!confirmou) {
            return;
        }

        Memoria.resetar();

        alert(
            "A memória foi apagada."
        );

        desenhar();

    }

    function sair() {

        const endereco =
            new URL(window.location.href);

        endereco.searchParams.delete("dev");

        window.location.replace(
            endereco.toString()
        );

    }

    function desenhar() {

        const area =
            obterAreaPrincipal();

        const encontros =
            obterEncontros();

        const memoria =
            Memoria.carregar();

        const opcoes =
            encontros.map(
                (encontro, indice) => {

                    const numero =
                        indice + 1;

                    const titulo =
                        encontro?.titulo ||
                        `Encontro ${numero}`;

                    return `
                        <option value="${numero}">
                            ${numero} — ${titulo}
                        </option>
                    `;

                }
            ).join("");

        area.classList.remove(
            "oculto"
        );

        area.classList.add(
            "visivel"
        );

        area.innerHTML = `
            <section
                style="
                    width:min(92vw,560px);
                    margin:0 auto;
                    padding:28px 20px;
                    box-sizing:border-box;
                    text-align:left;
                "
            >
                <h1
                    style="
                        margin:0 0 8px;
                        text-align:center;
                        font-size:1.6rem;
                    "
                >
                    Ferramentas do Guardião
                </h1>

                <p
                    style="
                        margin:0 0 28px;
                        text-align:center;
                        opacity:.75;
                    "
                >
                    ${encontros.length} encontro(s) carregado(s)
                </p>

                <div
                    style="
                        margin-bottom:24px;
                        line-height:1.7;
                    "
                >
                    <strong>Memória atual</strong><br>
                    Nome: ${memoria.nome || "não informado"}<br>
                    Próximo encontro: ${memoria.encontroAtual + 1}
                </div>

                <label
                    for="dev-encontro"
                    style="
                        display:block;
                        margin-bottom:8px;
                    "
                >
                    Escolha um encontro
                </label>

                <select
                    id="dev-encontro"
                    style="
                        width:100%;
                        padding:12px;
                        margin-bottom:12px;
                        border-radius:10px;
                        font-size:1rem;
                    "
                >
                    ${opcoes}
                </select>

                <button
                    id="dev-abrir"
                    class="botao"
                    style="
                        width:100%;
                        margin-bottom:12px;
                    "
                >
                    Abrir encontro
                </button>

                <button
                    id="dev-reiniciar"
                    class="botao"
                    style="
                        width:100%;
                        margin-bottom:12px;
                    "
                >
                    Reiniciar Jornada 1
                </button>

                <button
                    id="dev-limpar"
                    class="botao"
                    style="
                        width:100%;
                        margin-bottom:12px;
                    "
                >
                    Apagar memória
                </button>

                <button
                    id="dev-sair"
                    class="botao"
                    style="
                        width:100%;
                    "
                >
                    Sair das ferramentas
                </button>
            </section>
        `;

        const seletor =
            document.getElementById(
                "dev-encontro"
            );

        if (
            memoria.encontroAtual <
            encontros.length
        ) {
            seletor.value =
                String(
                    memoria.encontroAtual + 1
                );
        }

        document
            .getElementById("dev-abrir")
            .addEventListener(
                "click",
                () => abrirEncontro(
                    seletor.value
                )
            );

        document
            .getElementById("dev-reiniciar")
            .addEventListener(
                "click",
                reiniciarJornada1
            );

        document
            .getElementById("dev-limpar")
            .addEventListener(
                "click",
                limparMemoria
            );

        document
            .getElementById("dev-sair")
            .addEventListener(
                "click",
                sair
            );

    }

    function iniciar() {

        if (!modoDevSolicitado()) {
            return false;
        }

        window.GUARDIAO_DEV_ATIVO = true;

        if (
            document.readyState === "loading"
        ) {

            document.addEventListener(
                "DOMContentLoaded",
                desenhar,
                { once: true }
            );

        } else {

            desenhar();

        }

        return true;

    }

    return {
        iniciar,
        desenhar,
        abrirEncontro,
        reiniciarJornada1
    };

})();

FerramentasDev.iniciar();
