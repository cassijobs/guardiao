/*
==========================================
NÚCLEO DO GUARDIÃO
==========================================
Responsável por controlar a experiência.
Não conhece nenhuma frase.
==========================================
*/
 
let guardiao;

function iniciarNucleo() {
    guardiao = document.getElementById("guardiao");
} 
const nucleo = {

    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    limpar() {
        guardiao.innerHTML = "";
    },

    async mostrar(texto, pausa = CONFIG.pausa.media) {

        guardiao.innerHTML = texto;

        await this.esperar(pausa);

    },

    async executar(lista) {

        for (const texto of lista) {

            await this.mostrar(texto);

            await this.esperar(CONFIG.pausa.curta);

        }

    }

};
