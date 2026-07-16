/*
======================================================
ALTERAÇÃO NECESSÁRIA NO condutor.js
======================================================

No final da função que percorre as cenas de um encontro,
adicione a chamada de conclusão.

Exemplo:

const Condutor = {
    async executar(encontro, opcoes = {}) {
        for (const cena of encontro.cenas) {
            await this.executarCena(cena, opcoes);
        }

        // IMPORTANTE:
        // só marca o próximo horário depois da última cena.
        if (typeof opcoes.aoConcluir === "function") {
            opcoes.aoConcluir();
        }
    },

    async executarCena(cena, opcoes = {}) {
        // Mantenha aqui o código que você já possui.
    }
};

Se seu Condutor já tem uma função chamada executarEncontro(),
rodar(), iniciar() ou conduzir(), coloque as mesmas quatro linhas
no final dessa função:

if (typeof opcoes.aoConcluir === "function") {
    opcoes.aoConcluir();
}

Não coloque essa chamada dentro da cena "fim", porque alguns
encontros podem terminar antecipadamente com "Ainda não".
======================================================
*/
