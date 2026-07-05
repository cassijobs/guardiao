/*
======================================================
GUARDIÃO v2.0.1
MEMÓRIA
======================================================
*/

const MEMORIA = {
    nome: "",
    encontroAtual: 1,
    totalEncontros: 0,
    toquesNoSilencio: 0,
    escolhas: [],

    carregar() {
        const dados = localStorage.getItem(CONFIG.armazenamento.chave);

        if (!dados) return;

        try {
            const memoriaSalva = JSON.parse(dados);
            Object.assign(this, memoriaSalva);
        } catch (erro) {
            console.warn("Não foi possível carregar a memória do Guardião.", erro);
        }
    },

    salvar() {
        const dados = {
            nome: this.nome,
            encontroAtual: this.encontroAtual,
            totalEncontros: this.totalEncontros,
            escolhas: this.escolhas
        };

        localStorage.setItem(CONFIG.armazenamento.chave, JSON.stringify(dados));
    },

    resetar() {
        localStorage.removeItem(CONFIG.armazenamento.chave);
        this.nome = "";
        this.encontroAtual = 1;
        this.totalEncontros = 0;
        this.toquesNoSilencio = 0;
        this.escolhas = [];
    }
};
