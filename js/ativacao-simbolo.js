/*
======================================================
GUARDIÃO — RITUAL DE PRIMEIRA ATIVAÇÃO
======================================================

Fluxo:
1. O NFC abre o Guardião com ?artefato=MKS-XXXXX.
2. Na primeira utilização daquele artefato neste navegador,
   a jornada é interrompida e o símbolo é solicitado.
3. O leitor AR reconhece o símbolo correspondente.
4. A liberação é gravada no localStorage.
5. Nas próximas aproximações, o Guardião abre normalmente.

A liberação é individual por artefato e por navegador.
======================================================
*/

const AtivacaoSimbolo = (() => {

    const PARAMETRO_ARTEFATO = "artefato";
    const PARAMETRO_ATIVADO = "ativado";
    const PARAMETRO_LEITURA = "leitura";
    const PARAMETRO_ORIGEM = "origem";
    const CHAVE_ULTIMA_LEITURA = "guardiao_ultima_leitura_confirmada";
    const PREFIXO_CHAVE = "guardiao_ativado_";

    const PADRAO_ATUAL = /^MKS-[A-Z0-9]{5}$/;
    const PADRAO_ANTIGO = /^GRD-MKS-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

    function normalizar(codigo) {
        return String(codigo || "")
            .trim()
            .toUpperCase();
    }

    function codigoAceito(codigo) {
        const valor = normalizar(codigo);
        return PADRAO_ATUAL.test(valor) || PADRAO_ANTIGO.test(valor);
    }

    function obterCodigoDaUrl() {
        const parametros = new URLSearchParams(window.location.search);
        return normalizar(parametros.get(PARAMETRO_ARTEFATO));
    }

    function chaveDoArtefato(codigo) {
        return PREFIXO_CHAVE + normalizar(codigo);
    }

    function estaAtivado(codigo) {
        if (!codigoAceito(codigo)) {
            return false;
        }

        try {
            const registro = localStorage.getItem(chaveDoArtefato(codigo));
            if (!registro) {
                return false;
            }

            const dados = JSON.parse(registro);
            return Boolean(
                dados &&
                dados.ativado === true &&
                normalizar(dados.codigo) === normalizar(codigo)
            );
        } catch (erro) {
            console.warn("Não foi possível consultar a primeira ativação.", erro);
            return false;
        }
    }

    function registrarAtivacaoRecebida(codigo) {
        const valor = normalizar(codigo);

        if (!codigoAceito(valor)) {
            return false;
        }

        try {
            localStorage.setItem(
                chaveDoArtefato(valor),
                JSON.stringify({
                    ativado: true,
                    codigo: valor,
                    origem: "leitor",
                    ativadoEm: new Date().toISOString(),
                    versao: 3
                })
            );
            return true;
        } catch (erro) {
            console.warn("Não foi possível registrar a ativação recebida do leitor.", erro);
            return false;
        }
    }

    function comprovanteRecente(codigo) {
        const esperado = normalizar(codigo);
        const armazenamentos = [];

        try { armazenamentos.push(sessionStorage); } catch (_) {}
        try { armazenamentos.push(localStorage); } catch (_) {}

        for (const armazenamento of armazenamentos) {
            try {
                const bruto = armazenamento.getItem(CHAVE_ULTIMA_LEITURA);
                if (!bruto) continue;
                const dados = JSON.parse(bruto);
                const idade = Date.now() - Number(dados?.instante || 0);
                if (
                    dados?.confirmado === true &&
                    normalizar(dados?.codigo) === esperado &&
                    idade >= 0 && idade < 10 * 60 * 1000
                ) {
                    armazenamento.removeItem(CHAVE_ULTIMA_LEITURA);
                    return true;
                }
            } catch (_) {
                // Ignora comprovantes inválidos e tenta a outra origem.
            }
        }

        return false;
    }

    function limparParametroDeRetorno() {
        const url = new URL(window.location.href);
        let mudou = false;

        [PARAMETRO_ATIVADO, PARAMETRO_LEITURA, PARAMETRO_ORIGEM].forEach(parametro => {
            if (url.searchParams.has(parametro)) {
                url.searchParams.delete(parametro);
                mudou = true;
            }
        });

        if (url.hash === "#simbolo-reconhecido") {
            url.hash = "";
            mudou = true;
        }

        if (mudou) {
            history.replaceState({}, "", url.toString());
        }
    }

    function obterBasePublica() {
        const url = new URL(window.location.href);
        const partes = url.pathname.split("/").filter(Boolean);
        const tecnicas = new Set(["AR", "app", "primeiro-passo"]);

        while (partes.length && tecnicas.has(partes[partes.length - 1])) {
            partes.pop();
        }

        return `${url.origin}/${partes.join("/")}${partes.length ? "/" : ""}`;
    }

    function criarUrlDoLeitor(codigo) {
        const base = obterBasePublica();
        const leitor = new URL("AR/", base);
        const retorno = new URL(base);

        retorno.searchParams.set(PARAMETRO_ARTEFATO, normalizar(codigo));
        retorno.searchParams.set(PARAMETRO_ATIVADO, "1");
        retorno.searchParams.set(PARAMETRO_LEITURA, "confirmada");
        retorno.searchParams.set(PARAMETRO_ORIGEM, "leitor");
        retorno.hash = "simbolo-reconhecido";

        leitor.searchParams.set("modo", "ativacao");
        leitor.searchParams.set(PARAMETRO_ARTEFATO, normalizar(codigo));
        leitor.searchParams.set("retorno", retorno.toString());
        leitor.searchParams.set("v", "190");

        return leitor.toString();
    }

    function inserirEstilos() {
        if (document.getElementById("guardiao-estilo-ativacao")) {
            return;
        }

        const estilo = document.createElement("style");
        estilo.id = "guardiao-estilo-ativacao";
        estilo.textContent = `
            html.ativacao-guardiao,
            html.ativacao-guardiao body {
                width: 100%;
                height: 100%;
                margin: 0;
                overflow: hidden;
                background: #21140c;
            }

            #guardiao-primeira-ativacao {
                position: fixed;
                inset: 0;
                z-index: 2147483647;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                min-height: 100vh;
                min-height: 100dvh;
                padding: max(24px, env(safe-area-inset-top)) 22px
                         max(24px, env(safe-area-inset-bottom));
                color: #efd5a0;
                text-align: center;
                font-family: Georgia, "Times New Roman", serif;
                background:
                    radial-gradient(
                        ellipse at 50% 38%,
                        rgba(218, 166, 82, .13),
                        transparent 58%
                    ),
                    linear-gradient(180deg, #160d07, #29180e 54%, #3a281a);
            }

            #guardiao-primeira-ativacao * {
                box-sizing: border-box;
            }

            .guardiao-ativacao-conteudo {
                width: min(680px, 94vw);
                opacity: 0;
                transform: translateY(10px);
                animation: guardiaoEntradaAtivacao 1.5s ease forwards;
            }

            .guardiao-ativacao-marca {
                margin: 0;
                color: #d4a55a;
                font-size: clamp(1rem, 3.5vw, 1.22rem);
                font-weight: normal;
                letter-spacing: .28em;
            }

            .guardiao-ativacao-estrela {
                margin: 18px 0 22px;
                color: #d4a55a;
                font-size: clamp(1.45rem, 5vw, 1.9rem);
                line-height: 1;
            }

            .guardiao-ativacao-fala {
                margin: 0 auto;
                font-size: clamp(1.52rem, 5.7vw, 2.3rem);
                line-height: 1.43;
                text-wrap: balance;
            }

            .guardiao-ativacao-secundaria {
                width: min(610px, 100%);
                margin: 22px auto 0;
                color: rgba(239, 213, 160, .78);
                font-size: clamp(1.08rem, 4.2vw, 1.38rem);
                line-height: 1.5;
                text-wrap: balance;
            }

            .guardiao-ativacao-botao {
                appearance: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: min(330px, 86vw);
                min-height: 56px;
                margin-top: 34px;
                padding: 14px 25px;
                border: 1px solid rgba(212, 165, 90, .72);
                border-radius: 999px;
                color: #efd5a0;
                background: rgba(83, 52, 27, .58);
                box-shadow:
                    0 12px 30px rgba(0, 0, 0, .24),
                    inset 0 0 22px rgba(212, 165, 90, .06);
                font: inherit;
                font-size: .92rem;
                letter-spacing: .13em;
                text-transform: uppercase;
                cursor: pointer;
                transition:
                    background .3s ease,
                    border-color .3s ease,
                    transform .3s ease;
            }

            .guardiao-ativacao-botao:active {
                transform: scale(.98);
            }

            .guardiao-ativacao-nota {
                display: block;
                width: min(520px, 92vw);
                margin: 20px auto 0;
                color: rgba(239, 213, 160, .55);
                font-size: .94rem;
                line-height: 1.45;
            }

            @keyframes guardiaoEntradaAtivacao {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-height: 680px) {
                .guardiao-ativacao-fala {
                    font-size: clamp(1.32rem, 5vw, 1.82rem);
                }

                .guardiao-ativacao-secundaria {
                    margin-top: 16px;
                    font-size: clamp(1rem, 3.8vw, 1.22rem);
                }

                .guardiao-ativacao-botao {
                    margin-top: 24px;
                }
            }
        `;

        document.head.appendChild(estilo);
    }

    function mostrarTela(codigo) {
        document.documentElement.classList.add("ativacao-guardiao");
        inserirEstilos();

        const tela = document.createElement("section");
        tela.id = "guardiao-primeira-ativacao";
        tela.setAttribute("aria-live", "polite");

        tela.innerHTML = `
            <div class="guardiao-ativacao-conteudo">
                <h1 class="guardiao-ativacao-marca">GUARDIÃO</h1>
                <div class="guardiao-ativacao-estrela" aria-hidden="true">✦</div>

                <p class="guardiao-ativacao-fala">
                    Antes do primeiro encontro, há algo que precisa ser encontrado.
                </p>

                <p class="guardiao-ativacao-secundaria">
                    O símbolo que acompanha este artefato permitirá que a caminhada comece.
                </p>

                <a
                    id="guardiao-abrir-simbolo"
                    class="guardiao-ativacao-botao"
                    href="${criarUrlDoLeitor(codigo)}"
                >
                    Encontrar o símbolo
                </a>

                <small class="guardiao-ativacao-nota">
                    Esta etapa será solicitada apenas na primeira ativação deste artefato neste aparelho.
                </small>
            </div>
        `;

        document.body.appendChild(tela);

        const botao = document.getElementById("guardiao-abrir-simbolo");
        botao.addEventListener("click", () => {
            botao.textContent = "Abrindo o leitor…";

            try {
                sessionStorage.setItem(
                    "guardiao_ativacao_pendente",
                    normalizar(codigo)
                );
            } catch (_) {
                // O href continua funcionando sem armazenamento de sessão.
            }
        });
    }

    async function preparar() {
        const codigo = obterCodigoDaUrl();
        const parametros = new URLSearchParams(window.location.search);
        const retornouAtivado =
            parametros.get(PARAMETRO_ATIVADO) === "1" ||
            parametros.get(PARAMETRO_LEITURA) === "confirmada" ||
            parametros.get(PARAMETRO_ORIGEM) === "leitor" ||
            window.location.hash === "#simbolo-reconhecido" ||
            comprovanteRecente(codigo);

        if (!codigo || !codigoAceito(codigo)) {
            return true;
        }

        // A leitura normal do AR já é a confirmação do símbolo. O leitor
        // devolve ativado=1; registramos a liberação antes de iniciar a
        // jornada e removemos apenas o parâmetro técnico da URL.
        if (estaAtivado(codigo)) {
            limparParametroDeRetorno();
            return true;
        }

        if (retornouAtivado) {
            registrarAtivacaoRecebida(codigo);
            limparParametroDeRetorno();
            return true;
        }

        mostrarTela(codigo);
        return false;
    }

    return {
        preparar,
        estaAtivado,
        codigoAceito
    };

})();

window.AtivacaoSimbolo = AtivacaoSimbolo;
