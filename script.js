const app = document.getElementById("app");

const PAUSA_CURTA = 2000;
const PAUSA_MEDIA = 3000;
const PAUSA_LONGA = 4000;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function mostrarTexto(texto, delay = PAUSA_MEDIA) {
    app.innerHTML = texto;
    await sleep(delay);
}

async function falarSequencia(lista) {
    for (const frase of lista) {
        await mostrarTexto(frase, PAUSA_MEDIA);
        await sleep(PAUSA_CURTA);
    }
}

async function pedirNome() {

    app.innerHTML = `
        <div style="margin-bottom:30px;font-size:22px;">
            Como devo chamá-lo?
        </div>

        <input
            id="nome"
            placeholder="Digite seu nome"
            autofocus
            style="
                font-size:22px;
                padding:12px;
                width:80%;
                border:none;
                border-bottom:1px solid #555;
                background:transparent;
                color:white;
                text-align:center;
                outline:none;
            "
        >

        <div style="
            display:flex;
            justify-content:center;
            margin-top:35px;
        ">

            <button id="btnEnter" class="botaoGuardiao">
                Entrar
            </button>

        </div>
    `;

    return new Promise(resolve => {

        const input = document.getElementById("nome");
        const botao = document.getElementById("btnEnter");

        function confirmar(){

            const valor = input.value.trim();

            if(valor.length > 0){
                resolve(valor);
            }

        }

        botao.addEventListener("click", confirmar);

        input.addEventListener("keydown",(e)=>{

            if(e.key==="Enter"){
                confirmar();
            }

        });

    });

}

async function iniciar(){

    app.innerHTML="";

    await sleep(PAUSA_MEDIA);

    await falarSequencia(dialogo.inicio);

    const nome = await pedirNome();

    await mostrarTexto(`Obrigado, ${nome}.`,PAUSA_MEDIA);

    await mostrarTexto("Agora conheço a forma como o mundo chama você.",PAUSA_LONGA);

    await falarSequencia(dialogo.compromisso);

    app.innerHTML=`

        <div style="margin-bottom:35px;">
            Você está disposto a reservar alguns instantes para refletir sobre si mesmo?
        </div>

        <div style="
            display:flex;
            justify-content:center;
            gap:30px;
        ">

            <button class="botaoGuardiao" onclick="continuar()">
                Sim
            </button>

            <button class="botaoGuardiao" onclick="encerrar()">
                Não
            </button>

        </div>

    `;

}

async function continuar(){

    await falarSequencia(dialogo.reflexao);

    await falarSequina(dialogo.fim);

}

async function encerrar(){

    app.innerHTML="Tudo tem seu tempo.";

}

iniciar();
