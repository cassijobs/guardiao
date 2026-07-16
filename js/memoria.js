/*
======================================================
GUARDIÃO v3.1
MEMÓRIA
======================================================
Arquivo: memoria.js
Objeto global: Memoria
======================================================
*/

const Memoria = (() => {

    const CHAVE = "guardiao_memoria_v3_1";

    const PADRAO = {
        nome: "",
        encontroAtual: 0,
        escolhas: [],
        toquesNoSilencio: 0,
        proximoEncontroEm: 0,
        ultimoEncontroConcluidoEm: 0,
        encontroEmAndamento: false,
        versao: "3.1"
    };

    function lerMemoriaAntiga() {
        const chavesAntigas = [
            "guardiao_memoria_v2_1",
            "guardiao_memoria",
            "guardiaoMemoria",
            "memoriaGuardiao"
        ];

        for (const chave of chavesAntigas) {
            try {
                const valor = localStorage.getItem(chave);

                if (valor) {
                    return JSON.parse(valor);
                }
            } catch (erro) {
                console.warn(
                    "Não foi possível ler a memória antiga:",
                    chave
                );
            }
        }

        return {};
    }

    function normalizar(dados = {}) {
        const memoria = {
            ...PADRAO,
            ...dados
        };

        memoria.nome = String(
            memoria.nome || ""
        ).trim();

        memoria.encontroAtual = Math.max(
            0,
            Number.parseInt(
                memoria.encontroAtual ??
                memoria.encontro ??
                0,
                10
            ) || 0
        );

        memoria.escolhas = Array.isArray(
            memoria.escolhas
        )
            ? memoria.escolhas
            : [];

        memoria.toquesNoSilencio =
            Number.parseInt(
                memoria.toquesNoSilencio,
                10
            ) || 0;

        memoria.proximoEncontroEm =
            Number(memoria.proximoEncontroEm) || 0;

        memoria.ultimoEncontroConcluidoEm =
            Number(
                memoria.ultimoEncontroConcluidoEm
            ) || 0;

        memoria.encontroEmAndamento =
            Boolean(memoria.encontroEmAndamento);

        return memoria;
    }

    function salvar(dados) {
        const memoria = normalizar(dados);

        localStorage.setItem(
            CHAVE,
            JSON.stringify(memoria)
        );

        return memoria;
    }

    function carregar() {
        let salva = {};

        try {
            const valor = localStorage.getItem(CHAVE);

            if (valor) {
                salva = JSON.parse(valor);
            }
        } catch (erro) {
            console.warn(
                "A memória salva estava inválida e foi ignorada."
            );
        }

        if (!Object.keys(salva).length) {
            salva = lerMemoriaAntiga();
        }

        return salvar(salva);
    }

    function atualizar(alteracoes = {}) {
        return salvar({
            ...carregar(),
            ...alteracoes
        });
    }

    function salvarNome(nome) {
        return atualizar({
            nome: String(nome || "").trim()
        });
    }

    function registrarEscolha(escolha) {
        const dados = carregar();

        return atualizar({
            escolhas: [
                ...dados.escolhas,
                escolha
            ]
        });
    }

    function definirToquesNoSilencio(quantidade) {
        return atualizar({
            toquesNoSilencio:
                Number.parseInt(quantidade, 10) || 0
        });
    }

    function podeIniciarAgora(
        dados = carregar()
    ) {
        return (
            !dados.proximoEncontroEm ||
            Date.now() >= dados.proximoEncontroEm
        );
    }

    function tempoRestante(
        dados = carregar()
    ) {
        return Math.max(
            0,
            dados.proximoEncontroEm - Date.now()
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
                    ? agora +
                      CONFIG.intervaloEntreEncontros
                    : 0,
            encontroEmAndamento: false
        });
    }

    function liberarAgora() {
        return atualizar({
            proximoEncontroEm: 0
        });
    }

    function irParaEncontro(numero) {
        const indice = Math.max(
            0,
            Number.parseInt(numero, 10) - 1
        );

        return atualizar({
            encontroAtual: indice,
            proximoEncontroEm: 0,
            encontroEmAndamento: false
        });
    }

    function resetar() {
        localStorage.removeItem(CHAVE);

        return salvar({
            ...PADRAO
        });
    }

    return {
        carregar,
        salvar,
        atualizar,
        salvarNome,
        registrarEscolha,
        definirToquesNoSilencio,
        podeIniciarAgora,
        tempoRestante,
        iniciarEncontro,
        concluirEncontro,
        liberarAgora,
        irParaEncontro,
        resetar
    };

})();
