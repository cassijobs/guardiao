/* GUARDIÃO v5.0 — memória da caminhada, independente do Artefato */
const Memoria = (() => {
    const CHAVE_CONTEXTO = "guardiao_caminhada_atual_v5";
    const CHAVES_CONTEXTO_LEGADAS = ["guardiao_caminhada_atual_v4_1"];
    const CHAVE_LEGADA = "guardiao_memoria_v4_0";
    const PADRAO = Object.freeze({
        nome: "",
        encontroAtual: 0,
        escolhas: [],
        toquesNoSilencio: 0,
        proximoEncontroEm: 0,
        ultimoEncontroConcluidoEm: 0,
        ultimoEncontroData: "",
        encontroEmAndamento: false,
        visitasAntecipadas: 0,
        aguardouEncontro: false,
        versao: "5.0"
    });

    let contexto = null;
    let filaSincronizacao = Promise.resolve();

    function dataLocal(data = new Date()) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");
        return `${ano}-${mes}-${dia}`;
    }

    function inicioDoProximoDia() {
        const data = new Date();
        data.setHours(24, 0, 0, 0);
        return data.getTime();
    }

    function criarVazia() {
        return normalizar({});
    }

    function chave() {
        return contexto?.caminhadaId
            ? `guardiao_memoria_v5_${contexto.caminhadaId}`
            : "guardiao_memoria_v5_sem_vinculo";
    }

    function normalizar(dados = {}) {
        const memoria = { ...PADRAO, ...dados };
        memoria.nome = String(memoria.nome || "").trim();
        memoria.encontroAtual = Math.max(0, Number.parseInt(memoria.encontroAtual ?? memoria.encontro ?? 0, 10) || 0);
        memoria.escolhas = Array.isArray(memoria.escolhas) ? memoria.escolhas : [];
        memoria.toquesNoSilencio = Number.parseInt(memoria.toquesNoSilencio, 10) || 0;
        memoria.proximoEncontroEm = Number(memoria.proximoEncontroEm) || 0;
        memoria.ultimoEncontroConcluidoEm = Number(memoria.ultimoEncontroConcluidoEm) || 0;
        memoria.ultimoEncontroData = String(memoria.ultimoEncontroData || "");
        if (!memoria.ultimoEncontroData && memoria.ultimoEncontroConcluidoEm) {
            memoria.ultimoEncontroData = dataLocal(new Date(memoria.ultimoEncontroConcluidoEm));
        }
        memoria.encontroEmAndamento = Boolean(memoria.encontroEmAndamento);
        memoria.visitasAntecipadas = Math.max(0, Number.parseInt(memoria.visitasAntecipadas, 10) || 0);
        memoria.aguardouEncontro = Boolean(memoria.aguardouEncontro);
        memoria.versao = "5.0";
        return memoria;
    }

    function definirContexto(novoContexto) {
        contexto = novoContexto || null;
        if (contexto) localStorage.setItem(CHAVE_CONTEXTO, JSON.stringify(contexto));
    }

    function obterContexto() {
        if (contexto) return contexto;
        const chaves = [CHAVE_CONTEXTO, ...CHAVES_CONTEXTO_LEGADAS];
        for (const chaveContexto of chaves) {
            try {
                const valor = JSON.parse(localStorage.getItem(chaveContexto) || "null");
                if (valor?.caminhadaId) {
                    contexto = valor;
                    localStorage.setItem(CHAVE_CONTEXTO, JSON.stringify(valor));
                    return contexto;
                }
            } catch (erro) {
                console.warn("Contexto antigo inválido foi ignorado.", erro);
            }
        }
        return null;
    }

    function limparContexto() {
        contexto = null;
        localStorage.removeItem(CHAVE_CONTEXTO);
        CHAVES_CONTEXTO_LEGADAS.forEach(chaveContexto => localStorage.removeItem(chaveContexto));
    }

    function existeCaminhadaLocal() {
        return Boolean(obterContexto()?.caminhadaId);
    }

    function carregar() {
        let dados = {};
        try {
            dados = JSON.parse(localStorage.getItem(chave()) || "{}");
        } catch (erro) {
            console.warn("Memória local inválida foi ignorada.", erro);
        }

        if (!Object.keys(dados).length && !localStorage.getItem(chave())) {
            try {
                dados = JSON.parse(localStorage.getItem(CHAVE_LEGADA) || "{}");
            } catch (erro) {
                console.warn("Memória legada inválida foi ignorada.", erro);
            }
        }
        return salvar(dados, false);
    }

    function salvar(dados, sincronizar = true) {
        const memoria = normalizar(dados);
        localStorage.setItem(chave(), JSON.stringify(memoria));
        if (sincronizar) enfileirarSincronizacao(memoria);
        return memoria;
    }

    function enfileirarSincronizacao(memoria) {
        filaSincronizacao = filaSincronizacao
            .catch(() => undefined)
            .then(() => sincronizarRemoto(memoria));
        return filaSincronizacao;
    }

    async function sincronizarRemoto(memoria = carregar()) {
        const atual = obterContexto();
        if (!atual?.codigoArtefato || !window.ArtefatoGuardiao) return;
        try {
            await ArtefatoGuardiao.salvarProgresso(atual.codigoArtefato, memoria);
        } catch (erro) {
            console.warn("Progresso salvo apenas neste aparelho.", erro);
        }
    }

    function importarRemoto(dados) {
        return salvar(dados || {}, false);
    }

    function atualizar(alteracoes = {}) {
        return salvar({ ...carregar(), ...alteracoes });
    }

    function salvarNome(nome) { return atualizar({ nome: String(nome || "").trim() }); }
    function registrarEscolha(escolha) {
        const dados = carregar();
        return atualizar({ escolhas: [...dados.escolhas, escolha] });
    }
    function definirToquesNoSilencio(quantidade) { return atualizar({ toquesNoSilencio: Number.parseInt(quantidade, 10) || 0 }); }
    function podeIniciarAgora(dados = carregar()) { return !dados.ultimoEncontroData || dados.ultimoEncontroData !== dataLocal(); }
    function tempoRestante(dados = carregar()) { return podeIniciarAgora(dados) ? 0 : Math.max(0, inicioDoProximoDia() - Date.now()); }
    function iniciarEncontro() { return atualizar({ encontroEmAndamento: true }); }
    function concluirEncontro(total) {
        const dados = carregar();
        const agora = Date.now();
        const proximo = Math.min(dados.encontroAtual + 1, total);
        return atualizar({
            encontroAtual: proximo,
            ultimoEncontroConcluidoEm: agora,
            ultimoEncontroData: dataLocal(),
            proximoEncontroEm: proximo < total ? inicioDoProximoDia() : 0,
            encontroEmAndamento: false,
            aguardouEncontro: false
        });
    }
    function registrarVisitaAntecipada() {
        const dados = carregar();
        return atualizar({ visitasAntecipadas: dados.visitasAntecipadas + 1, aguardouEncontro: true });
    }
    function consumirEsperaCumprida() {
        const dados = carregar();
        if (!dados.aguardouEncontro) return false;
        atualizar({ aguardouEncontro: false });
        return true;
    }
    function liberarAgora() { return atualizar({ proximoEncontroEm: 0, ultimoEncontroData: "" }); }
    function irParaEncontro(numero) {
        return atualizar({
            encontroAtual: Math.max(0, (Number.parseInt(numero, 10) || 1) - 1),
            proximoEncontroEm: 0,
            ultimoEncontroData: "",
            encontroEmAndamento: false,
            aguardouEncontro: false
        });
    }
    function resetar() {
        localStorage.removeItem(chave());
        return salvar(criarVazia());
    }

    return {
        criarVazia,
        definirContexto,
        obterContexto,
        limparContexto,
        existeCaminhadaLocal,
        carregar,
        salvar,
        importarRemoto,
        sincronizarRemoto,
        atualizar,
        salvarNome,
        registrarEscolha,
        definirToquesNoSilencio,
        podeIniciarAgora,
        tempoRestante,
        iniciarEncontro,
        concluirEncontro,
        registrarVisitaAntecipada,
        consumirEsperaCumprida,
        liberarAgora,
        irParaEncontro,
        resetar
    };
})();
