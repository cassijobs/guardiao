const nucleo = {

    async esperar(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    limpar(){
        app.innerHTML = "";
    },

    async mostrar(texto, pausa = PAUSA_MEDIA){

        app.innerHTML = texto;

        await this.esperar(pausa);

    },

    async executar(lista){

        for(const frase of lista){

            await this.mostrar(frase);

            await this.esperar(PAUSA_CURTA);

        }

    }

};