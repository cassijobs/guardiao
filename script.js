const app = document.getElementById("app");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mostrarTexto(texto, delay = 2000) {
  app.innerHTML = texto;
  await sleep(delay);
}

async function falarSequencia(lista) {
  for (let i = 0; i < lista.length; i++) {
    await mostrarTexto(lista[i]);
    await sleep(1200); // silêncio entre frases
  }
}

async function pedirNome() {
  app.innerHTML = `
    <div style="margin-bottom:20px;">
      Como devo chamá-lo?
    </div>

    <input id="nome"
      placeholder="Digite seu nome"
      autofocus
      style="
        font-size:20px;
        padding:12px;
        width:80%;
        border:none;
        border-bottom:1px solid #555;
        background:transparent;
        color:#fff;
        text-align:center;
        outline:none;
      "
    />

    <div style="margin-top:20px;">
      <button id="btnEnter"
        style="
          padding:10px 20px;
          font-size:18px;
          background:#fff;
          color:#000;
          border:none;
          cursor:pointer;
        ">
        Enter
      </button>
    </div>
  `;

  return new Promise(resolve => {
    const input = document.getElementById("nome");
    const btn = document.getElementById("btnEnter");

    function finalizar() {
      const valor = input.value.trim();
      if (valor.length > 0) resolve(valor);
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") finalizar();
    });

    btn.addEventListener("click", finalizar);
  });
}

async function iniciar() {

  app.innerHTML = "";
  await sleep(1000);

  await falarSequencia(dialogo.inicio);

  const nome = await pedirNome();

  await mostrarTexto(`Obrigado, ${nome}.`);
  await sleep(1500);

  await mostrarTexto("Agora conheço a forma como o mundo chama você.");
  await sleep(1500);

  await falarSequencia(dialogo.compromisso);

  app.innerHTML = `
    <p>Responda:</p>
    <button onclick="continuar()">Sim</button>
    <button onclick="encerrar()">Ainda não</button>
  `;
}

async function continuar() {
  await falarSequencia(dialogo.reflexao);
  await sleep(2000);
  await falarSequencia(dialogo.fim);
}

async function encerrar() {
  app.innerHTML = "Tudo tem seu tempo.";
}

iniciar();
