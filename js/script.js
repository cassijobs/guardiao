/*
======================================================
GUARDIÃO v2.1 — INICIALIZAÇÃO
Encontro seguinte marcado 24 horas após a conclusão
======================================================

Este arquivo pressupõe a estrutura já usada no projeto:

- CONFIG
- Memoria
- AgendaGuardiao
- JORNADA1
- Condutor

O Condutor deve expor:
    Condutor.executar(encontro, opcoes)

E chamar:
    opcoes.aoConcluir()

somente depois da última cena do encontro.
======================================================
*/

const app = document.getElementById("app");

async function iniciarGuardiao() {
    AgendaGuardiao.pararRelogio();

    const memoria = Memoria.carregar();
    const total = JORNADA1.length;

    if (memoria.encontroAtual >= total) {
        AgendaGuardiao.jornadaConcluida(app);
        return;
    }

    if (!Memoria.podeIniciarAgora(memoria)) {
        AgendaGuardiao.mostrarEspera(
            app,
            iniciarGuardiao
        );
        return;
    }

    const encontro = JORNADA1[memoria.encontroAtual];

    /*
     * Marcar "em andamento" não avança a jornada.
     * Se a página for fechada no meio, o mesmo encontro será
     * apresentado novamente.
     */
    Memoria.iniciarEncontro();

    await Condutor.executar(encontro, {
        nome: memoria.nome,

        aoSalvarNome(nome) {
            Memoria.salvarNome(nome);
        },

        aoConcluir() {
            /*
             * O horário é marcado neste ponto:
             * exatamente quando o encontro termina.
             */
            Memoria.concluirEncontro(total);
        }
    });
}

document.addEventListener(
    "DOMContentLoaded",
    iniciarGuardiao
);
