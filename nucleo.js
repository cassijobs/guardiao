/*
==========================================
NÚCLEO DO GUARDIÃO
==========================================
Responsável por controlar a experiência.
Não conhece nenhuma frase.
==========================================
*/

const nucleo = {

    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    limpar() {
        app.innerHTML = "";
    },

    async mostrar(texto, pausa = CONFIG.pausa.media) {

        app.innerHTML = texto;

        await this.esperar(pausa);

    },

    async executar(lista) {

        for (const texto of lista) {

            await this.mostrar(texto);

            await this.esperar(CONFIG.pausa.curta);

        }

    }

};
