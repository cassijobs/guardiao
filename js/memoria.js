/*
======================================================
GUARDIÃO — MEMÓRIA v2.1
Encontros marcados por intervalo real de 24 horas
======================================================
*/

const Memoria = (() => {
    const CHAVE = "guardiao_memoria_v2_1";

    const PADRAO = {
        nome: "",
        encontroAtual: 0,

        // Horário exato em que o próximo encontro poderá começar.
        proximoEncontroEm: 0,

        // Horário em que o último encontro foi concluído.
        ultimoEncontroConcluidoEm: 0,

        // Impede que um encontro interrompido avance a jornada.
        encontroEmAndamento: false,

        versao: "2.1"
    };

    function lerMemoriaAntiga() {
        /*
         * Tenta aproveitar versões anteriores sem apagar o progresso.
         * Acrescente outras chaves antigas aqui, caso tenham sido usadas.
         */
        const chavesAntigas = [
            "guardiao_memoria",
            "guardiaoMemoria",
            "memoriaGuardiao"
        ];

        for (const chave of chavesAntigas) {
            try {
                const valor = localStorage.getItem(chave);
                if (valor) return JSON.parse(valor);
            } catch (erro) {
                console.warn("Não foi possível ler a memória antiga:", chave);
            }
        }

        return {};
    }

    function carregar() {
        let salva = {};

        try {
            const valor = localStorage.getItem(CHAVE);
            if (valor) salva = JSON.parse(valor);
        } catch (erro) {
            console.warn("A memória salva estava inválida e foi ignorada.");
        }

        if (!Object.keys(salva).length) {
            salva = lerMemoriaAntiga();
        }

        const dados = {
            ...PADRAO,
            ...salva
        };

        /*
         * Compatibilidade com nomes usados em versões anteriores.
         */
        if (
            !Number.isInteger(dados.encontroAtual) &&
            Number.isInteger(dados.encontro)
        ) {
            dados.encontroAtual = dados.encontro;
        }

        dados.encontroAtual = Math.max(
            0,
            Number.parseInt(dados.encontroAtual, 10) || 0
        );

        dados.proximoEncontroEm =
            Number(dados.proximoEncontroEm) || 0;

        dados.ultimoEncontroConcluidoEm =
            Number(dados.ultimoEncontroConcluidoEm) || 0;

        dados.encontroEmAndamento =
            Boolean(dados.encontroEmAndamento);

        salvar(dados);
        return dados;
    }

    function salvar(dados) {
        localStorage.setItem(CHAVE, JSON.stringify(dados));
        return dados;
    }

    function atualizar(alteracoes) {
        const dados = carregar();
        return salvar({
            ...dados,
            ...alteracoes
        });
    }

    function podeIniciarAgora(dados = carregar()) {
        return (
            !dados.proximoEncontroEm ||
            Date.now() >= dados.proximoEncontroEm
        );
    }

    function tempoRestante(dados = carregar()) {
        return Math.max(
            0,
            (dados.proximoEncontroEm || 0) - Date.now()
        );
    }

    function iniciarEncontro() {
        return atualizar({
            encontroEmAndamento: true
        });
    }

    function concluirEncontro(totalDeEncontros) {
        const dados = carregar();
        const agora = Date.now();

        const proximoIndice = Math.min(
            dados.encontroAtual + 1,
            totalDeEncontros
        );

        return atualizar({
            encontroAtual: proximoIndice,
            ultimoEncontroConcluidoEm: agora,
            proximoEncontroEm:
                proximoIndice < totalDeEncontros
                    ? agora + CONFIG.intervaloEntreEncontros
                    : 0,
            encontroEmAndamento: false
        });
    }

    function salvarNome(nome) {
        return atualizar({
            nome: String(nome || "").trim()
        });
    }

    function resetar() {
        localStorage.removeItem(CHAVE);
        return salvar({ ...PADRAO });
    }

    return {
        carregar,
        salvar,
        atualizar,
        salvarNome,
        podeIniciarAgora,
        tempoRestante,
        iniciarEncontro,
        concluirEncontro,
        resetar
    };
})();
