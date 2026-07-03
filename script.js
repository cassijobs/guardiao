iniciarNucleo();
const app = document.getElementById("app");

async function pedirNome() {

    app.innerHTML = `
        <div style="margin-bottom:30px;font-size:26px;">
            Como devo chamá-lo?
        </div>

        <input
            id="nome"
            autofocus
            placeholder="Digite seu nome"
            style="
                font-size:22px;
                padding:12px;
                width:80%;
                background:transparent;
                border:none;
                border-bottom:1px solid #666;
                color:white;
                text-align:center;
                outline:none;
            "
        >

        <div style="margin-top:30px;">
            <button id="btnEntrar" class="botaoGuardiao">
                Entrar
            </button>
        </div>
    `;

    return new Promise(resolve => {

        const input = document.getElementById("nome");
        const botao = document.getElementById("btnEntrar");

        function confirmar() {

            const nome = input.value.trim();

            if (nome.length > 0) {
                resolve(nome);
            }

        }

        input.addEventListener("keydown", e => {

            if (e.key === "Enter")
                confirmar();

        });

        botao.addEventListener("click", confirmar);

    });

}

async function iniciar() {

    nucleo.limpar();

    await nucleo.esperar(CONFIG.pausa.media);

    await nucleo.executar(dialogo.inicio);

    const nome = await pedirNome();

    await nucleo.mostrar(`Obrigado, ${nome}.`, CONFIG.pausa.media);

    await nucleo.mostrar(
        "Agora conheço a forma como o mundo chama você.",
        CONFIG.pausa.longa
    );

    await nucleo.executar(dialogo.compromisso);

    app.innerHTML = `
        <div style="margin-bottom:30px;font-size:26px;">
            Você está disposto a reservar alguns instantes para refletir sobre si mesmo?
        </div>

        <button class="botaoGuardiao" onclick="continuar()">
            Sim
        </button>

        <br><br>

        <button class="botaoGuardiao" onclick="encerrar()">
            Ainda não
        </button>
    `;

}

async function continuar() {

    await nucleo.executar(dialogo.reflexao);

    nucleo.limpar();

    await nucleo.esperar(CONFIG.pausa.silencio);

    await nucleo.executar(dialogo.fim);

}

function encerrar() {

    app.innerHTML = "Tudo tem seu tempo.";

}

iniciar();
