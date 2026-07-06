const MEMORIA = {
    nome: "",
    encontroAtual: 1,
    ultimoEncontro: "",
    escolhas: [],

    carregar() {
        const dados = localStorage.getItem("guardiao_memoria");

        if (dados) {
            Object.assign(this, JSON.parse(dados));
        }
    },

    salvar() {
        localStorage.setItem("guardiao_memoria", JSON.stringify({
            nome: this.nome,
            encontroAtual: this.encontroAtual,
            ultimoEncontro: this.ultimoEncontro,
            escolhas: this.escolhas
        }));
    },

    resetar() {
        localStorage.removeItem("guardiao_memoria");

        this.nome = "";
        this.encontroAtual = 1;
        this.ultimoEncontro = "";
        this.escolhas = [];
    },

    hoje() {
        return new Date().toISOString().split("T")[0];
    },

    jaFezHoje() {
        return this.ultimoEncontro === this.hoje();
    },

    concluirEncontro(totalEncontros) {
        this.ultimoEncontro = this.hoje();

        if (this.encontroAtual < totalEncontros) {
            this.encontroAtual++;
        }

        this.salvar();
    }
};
