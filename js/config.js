/*
======================================================
GUARDIÃO v3.1
CONFIGURAÇÃO
======================================================
*/

const CONFIG = {
    pausa: {
        curta: 2000,
        media: 4000,
        longa: 6000,
        leitura: 6000,
        silencio: 3000
    },

    fade: 700,

    /*
     * Mantido apenas para compatibilidade com versões antigas.
     * A liberação atual acontece quando muda o dia no relógio
     * local do celular, e não após 24 horas completas.
     */
    intervaloEntreEncontros: 24 * 60 * 60 * 1000
};
