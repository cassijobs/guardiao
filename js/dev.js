/*
======================================================
GUARDIÃO v4.4
FERRAMENTAS DO DESENVOLVEDOR
======================================================
Abra o site com ?dev
======================================================
*/

window.GUARDIAO_DEV_ATIVO = false;
window.GUARDIAO_MODO_RAPIDO = localStorage.getItem("guardiao_dev_modo_rapido") === "1";

const FerramentasDev = (() => {
    const CHAVE_RAPIDO = "guardiao_dev_modo_rapido";

    function solicitado() {
        return new URLSearchParams(window.location.search).has("dev");
    }

    function areaPrincipal() {
        let area = document.getElementById("guardiao");
        if (area) return area;

        const app = document.getElementById("app");
        if (!app) throw new Error("Não foi encontrado #guardiao nem #app.");

        area = document.createElement("main");
        area.id = "guardiao";
        app.innerHTML = "";
        app.appendChild(area);
        return area;
    }

    function aplicarEstiloDaPagina() {
        document.documentElement.style.height = "100%";
        document.documentElement.style.overflow = "hidden";

        document.body.style.margin = "0";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.overflow = "hidden";
        document.body.style.boxSizing = "border-box";

        const app = document.getElementById("app");
        if (app) {
            app.style.width = "100%";
            app.style.height = "100%";
            app.style.overflow = "hidden";
        }

        const area = areaPrincipal();
        area.style.width = "100%";
        area.style.height = "100%";
        area.style.overflowY = "auto";
        area.style.overflowX = "hidden";
        area.style.boxSizing = "border-box";
        area.style.webkitOverflowScrolling = "touch";
        area.style.scrollBehavior = "smooth";
        area.style.display = "block";
        area.style.padding = "0";
    }

    function encontros() {
        const jornadas = [];
        for (let numero = 1; numero <= 25; numero++) {
            const nome = `JORNADA${numero}`;
            try {
                const valor = window.eval(`typeof ${nome} !== "undefined" ? ${nome} : null`);
                if (Array.isArray(valor)) jornadas.push(valor);
            } catch (erro) {
                console.warn(`Não foi possível verificar ${nome}.`, erro);
            }
        }
        return jornadas.flat();
    }

    function memoriaAtual() {
        return Memoria.carregar();
    }

    function salvarIndice(indice) {
        Memoria.atualizar({
            encontroAtual: Math.max(0, indice),
            proximoEncontroEm: 0,
            encontroEmAndamento: false
        });
    }

    function sairDoDev() {
        const url = new URL(window.location.href);
        url.searchParams.delete("dev");
        window.location.replace(url.toString());
    }

    function abrirNumero(numero) {
        const lista = encontros();
        const indice = Number.parseInt(numero, 10) - 1;
        if (!Number.isInteger(indice) || indice < 0 || indice >= lista.length) {
            alert(`O encontro ${numero} ainda não existe. Há ${lista.length} encontro(s) carregado(s).`);
            return;
        }
        salvarIndice(indice);
        sairDoDev();
    }

    function anterior() {
        const atual = Number(memoriaAtual().encontroAtual) || 0;
        abrirNumero(Math.max(1, atual));
    }

    function proximo() {
        const lista = encontros();
        const atual = Number(memoriaAtual().encontroAtual) || 0;
        abrirNumero(Math.min(lista.length, atual + 2));
    }

    function reiniciarMantendoNome() {
        const dados = memoriaAtual();
        Memoria.atualizar({
            nome: dados.nome,
            encontroAtual: 0,
            escolhas: [],
            toquesNoSilencio: 0,
            proximoEncontroEm: 0,
            ultimoEncontroConcluidoEm: 0,
            encontroEmAndamento: false
        });
        alert("A jornada voltou ao encontro 1. O nome foi mantido.");
        desenhar();
    }

    function esquecerNome() {
        Memoria.atualizar({ nome: "" });
        alert("O nome foi apagado. O progresso foi mantido.");
        desenhar();
    }

    function apagarTudo() {
        const confirmou = window.confirm("Isso apagará nome, progresso, escolhas e datas. Continuar?");
        if (!confirmou) return;
        Memoria.resetar();
        alert("Toda a memória foi apagada.");
        desenhar();
    }

    function modoRapidoAtivo() {
        return localStorage.getItem(CHAVE_RAPIDO) === "1";
    }

    function alternarModoRapido() {
        const novoValor = !modoRapidoAtivo();
        localStorage.setItem(CHAVE_RAPIDO, novoValor ? "1" : "0");
        window.GUARDIAO_MODO_RAPIDO = novoValor;
        desenhar();
    }

    function escaparHtml(texto) {
        return String(texto ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function mostrarRoteiro(numero) {
        const lista = encontros();
        const indice = Number.parseInt(numero, 10) - 1;
        const encontro = lista[indice];

        if (!encontro) {
            alert("Encontro não encontrado.");
            return;
        }

        aplicarEstiloDaPagina();
        const area = areaPrincipal();
        const cenas = Array.isArray(encontro.cenas) ? encontro.cenas : [];

        const linhas = cenas.map((cena, indiceCena) => {
            const conteudo = cena.texto || cena.pergunta || "(sem texto)";
            return `
                <div style="padding:14px 0;border-bottom:1px solid rgba(255,255,255,.15);">
                    <strong>${indiceCena + 1}. ${escaparHtml(cena.tipo)}</strong>
                    <div style="margin-top:7px;opacity:.86;line-height:1.55;">${escaparHtml(conteudo)}</div>
                </div>
            `;
        }).join("");

        area.innerHTML = `
            <section style="width:min(92vw,680px);margin:0 auto;padding:24px 18px calc(100px + env(safe-area-inset-bottom));box-sizing:border-box;text-align:left;">
                <div style="position:sticky;top:0;z-index:10;padding:12px 0 16px;background:rgba(0,0,0,.92);backdrop-filter:blur(8px);">
                    <h1 style="text-align:center;margin:0;line-height:1.3;">${numero} — ${escaparHtml(encontro.titulo || "Encontro")}</h1>
                </div>
                <div style="margin-top:10px;">${linhas || '<p style="text-align:center;opacity:.75;">Este encontro não possui cenas.</p>'}</div>
                <button id="dev-voltar" class="botao" style="width:100%;margin-top:24px;min-height:48px;">Voltar às ferramentas</button>
            </section>
        `;

        area.scrollTop = 0;
        document.getElementById("dev-voltar").addEventListener("click", desenhar);
    }

    function exportarMemoria() {
        const texto = JSON.stringify(memoriaAtual(), null, 2);
        const arquivo = new Blob([texto], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(arquivo);
        link.download = "guardiao-memoria.json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
    }

    function desenhar() {
        aplicarEstiloDaPagina();
        const area = areaPrincipal();
        const lista = encontros();
        const memoria = memoriaAtual();

        const opcoes = lista.map((encontro, indice) => `
            <option value="${indice + 1}">${String(indice + 1).padStart(3, "0")} — ${escaparHtml(encontro.titulo || "Sem título")}</option>
        `).join("");

        area.classList.remove("oculto");
        area.classList.add("visivel");

        area.innerHTML = `
            <section style="width:min(92vw,620px);min-height:100%;margin:0 auto;padding:0 18px calc(110px + env(safe-area-inset-bottom));box-sizing:border-box;text-align:left;">
                <header style="position:sticky;top:0;z-index:20;margin:0 -18px;padding:calc(18px + env(safe-area-inset-top)) 18px 16px;background:rgba(0,0,0,.94);backdrop-filter:blur(10px);box-shadow:0 8px 20px rgba(0,0,0,.22);">
                    <h1 style="text-align:center;margin:0 0 6px;line-height:1.25;">Ferramentas do Guardião</h1>
                    <p style="text-align:center;opacity:.75;margin:0;">${lista.length} encontro(s) carregado(s)</p>
                </header>

                <div style="margin:22px 0;padding:16px;border:1px solid rgba(255,255,255,.15);border-radius:14px;line-height:1.7;box-sizing:border-box;">
                    <strong>Memória atual</strong><br>
                    Nome: ${escaparHtml(memoria.nome || "não informado")}<br>
                    Próximo encontro: ${(Number(memoria.encontroAtual) || 0) + 1}<br>
                    Modo rápido: ${modoRapidoAtivo() ? "ativado" : "desativado"}
                </div>

                <label for="dev-encontro" style="display:block;margin-bottom:8px;">Escolha um encontro</label>
                <select id="dev-encontro" style="width:100%;min-height:48px;padding:12px;margin:0 0 12px;border-radius:10px;font-size:1rem;box-sizing:border-box;">${opcoes}</select>

                <button id="dev-abrir" class="botao" style="width:100%;min-height:48px;margin-bottom:10px;">Abrir encontro</button>

                <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:10px;">
                    <button id="dev-anterior" class="botao" style="min-height:48px;">Encontro anterior</button>
                    <button id="dev-proximo" class="botao" style="min-height:48px;">Próximo encontro</button>
                </div>

                <button id="dev-roteiro" class="botao" style="width:100%;min-height:48px;margin-bottom:10px;">Ver roteiro do encontro</button>
                <button id="dev-rapido" class="botao" style="width:100%;min-height:48px;margin-bottom:10px;">${modoRapidoAtivo() ? "Desativar" : "Ativar"} modo rápido</button>
                <button id="dev-reiniciar" class="botao" style="width:100%;min-height:48px;margin-bottom:10px;">Reiniciar jornada mantendo o nome</button>
                <button id="dev-esquecer" class="botao" style="width:100%;min-height:48px;margin-bottom:10px;">Esquecer apenas o nome</button>
                <button id="dev-exportar" class="botao" style="width:100%;min-height:48px;margin-bottom:10px;">Exportar memória</button>
                <button id="dev-apagar" class="botao" style="width:100%;min-height:48px;margin-bottom:10px;">Apagar tudo</button>
                <button id="dev-sair" class="botao" style="width:100%;min-height:48px;">Sair das ferramentas</button>
            </section>
        `;

        const seletor = document.getElementById("dev-encontro");
        const encontroAtual = Number(memoria.encontroAtual) || 0;
        if (seletor && encontroAtual < lista.length) seletor.value = String(encontroAtual + 1);

        document.getElementById("dev-abrir").onclick = () => abrirNumero(seletor.value);
        document.getElementById("dev-anterior").onclick = anterior;
        document.getElementById("dev-proximo").onclick = proximo;
        document.getElementById("dev-roteiro").onclick = () => mostrarRoteiro(seletor.value);
        document.getElementById("dev-rapido").onclick = alternarModoRapido;
        document.getElementById("dev-reiniciar").onclick = reiniciarMantendoNome;
        document.getElementById("dev-esquecer").onclick = esquecerNome;
        document.getElementById("dev-exportar").onclick = exportarMemoria;
        document.getElementById("dev-apagar").onclick = apagarTudo;
        document.getElementById("dev-sair").onclick = sairDoDev;

        area.scrollTop = 0;
    }

    function iniciar() {
        if (!solicitado()) return false;
        window.GUARDIAO_DEV_ATIVO = true;

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", desenhar, { once: true });
        } else {
            desenhar();
        }
        return true;
    }

    return { iniciar, desenhar };
})();

FerramentasDev.iniciar();
