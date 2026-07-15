/*
======================================================
GUARDIÃO — CONFIGURAÇÃO DO ENCONTRO MARCADO
======================================================
*/

const CONFIG = {
    pausa: {
        curta: 2000,
        media: 4000,
        longa: 6000,
        silencio: 3000
    },

    fade: 700,

    /*
     * O próximo encontro acontece exatamente 24 horas
     * após o término do encontro anterior.
     *
     * Para testar:
     * 30 segundos: 30 * 1000
     * 5 minutos:   5 * 60 * 1000
     * Produção:    24 * 60 * 60 * 1000
     */
    intervaloEntreEncontros: 1 * 60 * 1000
};
