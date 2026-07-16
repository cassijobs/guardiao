/*
======================================================
GUARDIÃO v3.1
FERRAMENTAS DE TESTE
======================================================
Use somente no console do navegador (F12).
======================================================
*/

const DEV = {

    mostrarMemoria() {
        const dados = Memoria.carregar();
        console.table(dados);
        return dados;
    },

    resetar() {
        Memoria.resetar();
        location.reload();
    },

    liberarAgora() {
        Memoria.liberarAgora();
        location.reload();
    },

    irParaEncontro(numero) {
        Memoria.irParaEncontro(numero);
        location.reload();
    }

};

console.info(
    "Guardião v3.1 carregado. " +
    "Comandos: DEV.mostrarMemoria(), " +
    "DEV.resetar(), DEV.liberarAgora(), " +
    "DEV.irParaEncontro(1)"
);
