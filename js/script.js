/*
======================================================
GUARDIÃO v5.0
INICIALIZAÇÃO DAS JORNADAS
======================================================
*/

function obterAreaGuardiao() {

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

function obterTodosOsEncontros() {

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

async function prepararCaminhada(app, artefato) {
    const codigo = artefato.codigo;

    /*
     * Primeiro tenta retomar a memória já existente para este código.
     * Só cria uma caminhada vazia quando o artefato realmente nunca foi
     * usado neste navegador. Isso evita apagar o progresso a cada acesso.
     */
    const remoto = await ArtefatoGuardiao.carregarProgresso(codigo);

    if (!remoto?.ok) {
        throw new Error("A caminhada vinculada não pôde ser carregada.");
    }

    Memoria.definirContexto({
        caminhadaId: remoto.caminhada_id,
        codigoArtefato: codigo
    });

    if (remoto.existe) {
        await Memoria.importarRemoto(remoto.progresso || {});
        return true;
    }

    const memoriaInicial = Memoria.criarVazia();
    const ativacao = await ArtefatoGuardiao.ativarNovaCaminhada(
        codigo,
        memoriaInicial
    );

    if (!ativacao?.ok) {
        throw new Error(
            `Não foi possível preparar este Artefato: ${
                ativacao?.motivo || "falha desconhecida"
            }.`
        );
    }

    Memoria.definirContexto({
        caminhadaId: ativacao.caminhada_id,
        codigoArtefato: codigo
    });
    await Memoria.importarRemoto(memoriaInicial);
    return true;
}


function mostrarEntradaManual(app) {
    app.innerHTML = `
        <section class="tela-espera entrada-artefato">
            <p class="fala-guardiao">Aproxime o Artefato para iniciar.</p>
            <p class="fala-guardiao fala-secundaria">
                Ou insira a chave encontrada no interior da caixa.
            </p>

            <form id="form-chave-artefato" class="form-chave-artefato" novalidate>
                <label class="rotulo-chave" for="chave-artefato">Chave do Artefato</label>
                <input
                    id="chave-artefato"
                    class="campo-chave-artefato"
                    type="text"
                    inputmode="text"
                    autocomplete="off"
                    autocapitalize="characters"
                    spellcheck="false"
                    maxlength="17"
                    placeholder="MKS-7ZKC4"
                    aria-describedby="mensagem-chave-artefato"
                >
                <button class="botao botao-continuar-chave" type="submit">Continuar</button>
                <p id="mensagem-chave-artefato" class="mensagem-chave" role="status" aria-live="polite"></p>
            </form>

            <p class="fala-guardiao fala-secundaria orientacao-chave">
                Nos próximos acessos, basta aproximar o NFC ou ler o QR Code do Artefato.
            </p>
        </section>`;

    const formulario = document.getElementById("form-chave-artefato");
    const campo = document.getElementById("chave-artefato");
    const mensagem = document.getElementById("mensagem-chave-artefato");

    campo.addEventListener("input", () => {
        const posicao = campo.selectionStart;
        campo.value = ArtefatoGuardiao.normalizar(campo.value).replace(/\s+/g, "");
        if (typeof posicao === "number") {
            campo.setSelectionRange(posicao, posicao);
        }
        mensagem.textContent = "";
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const codigo = ArtefatoGuardiao.normalizar(campo.value).replace(/\s+/g, "");

        if (!codigo) {
            mensagem.textContent = "Digite a chave impressa no interior da caixa.";
            campo.focus();
            return;
        }

        if (!ArtefatoGuardiao.codigoValido(codigo)) {
            mensagem.textContent = "Essa chave parece incompleta ou foi digitada incorretamente.";
            campo.focus();
            campo.select();
            return;
        }

        mensagem.textContent = "Reconhecendo o Artefato…";
        const destino = ArtefatoGuardiao.criarLink(codigo);
        window.location.assign(destino);
    });
}

async function iniciarGuardiao() {
    if (window.GUARDIAO_DEV_ATIVO === true) return;
    const app = obterAreaGuardiao();
    try {
        AgendaGuardiao.pararRelogio();
        const apresentacao = ArtefatoGuardiao.obterCodigoApresentado();
        if (!apresentacao.codigo) {
            mostrarEntradaManual(app);
            return;
        }
        if (!apresentacao.valido) {
            app.innerHTML='<section class="tela-espera"><p class="fala-guardiao">A chave apresentada não foi reconhecida.</p></section>'; return;
        }
        const artefato=await ArtefatoGuardiao.reconhecer(apresentacao.codigo);
        if (!artefato.reconhecido) {
            app.innerHTML='<section class="tela-espera"><p class="fala-guardiao">Este Artefato não está disponível.</p><p class="fala-guardiao fala-secundaria">Verifique o código impresso dentro da caixa.</p></section>'; return;
        }
        window.GUARDIAO_ARTEFATO_ATUAL=artefato;
        await prepararCaminhada(app,artefato);

        const encontros=obterTodosOsEncontros(), total=encontros.length;
        if(!total) throw new Error("Nenhum encontro foi carregado.");
        const memoria=Memoria.carregar();
        if(memoria.encontroAtual>=total){ AgendaGuardiao.jornadaConcluida(app); return; }
        if(!Memoria.podeIniciarAgora(memoria)){
            const visita=Memoria.registrarVisitaAntecipada();
            AgendaGuardiao.mostrarEspera(app,iniciarGuardiao,visita.visitasAntecipadas); return;
        }
        const encontro=await FornecedorEncontros.buscar(memoria.encontroAtual,encontros);
        if(!encontro||!Array.isArray(encontro.cenas)) throw new Error(`Encontro ${memoria.encontroAtual+1} inválido ou sem cenas.`);
        Memoria.iniciarEncontro();
        await Condutor.executar({...encontro,cenas:[SaudacaoGuardiao.cenaDeAbertura(),...encontro.cenas]}, {
            aoSalvarNome(nome){Memoria.salvarNome(nome);},
            aoConcluir(){Memoria.concluirEncontro(total);}
        });
    } catch(erro){
        console.error("Erro ao iniciar o Guardião:",erro);
        app.innerHTML='<main class="tela-espera"><p class="fala-guardiao">Não foi possível abrir esse encontro.</p><p class="fala-guardiao fala-secundaria">Tente novamente em alguns instantes.</p></main>';
    }
}

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarGuardiao,
        { once: true }
    );

} else {

    iniciarGuardiao();

}
