const app = document.getElementById("app");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




async function pedirNome() {
  app.innerHTML = "Como devo chamá-lo?<br><input id='nome' autofocus />";
  
  return new Promise(resolve => {
    const input = document.getElementById("nome");
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        resolve(input.value);
      }
    });
  });
}

async function iniciar() {

  app.innerHTML = "";
  await sleep(1000);

  await nucleo.executar(dialogo.inicio);

  const nome = await pedirNome();

  await mostrarTexto(`Obrigado, ${nome}.`);
  await sleep(1500);

  await mostrarTexto("Agora conheço a forma como o mundo chama você.");
  await sleep(1500);

  await nucleo.executar(dialogo.compromisso);

  app.innerHTML = `
    <p>Responda:</p>
    <button onclick="continuar()">Sim</button>
    <button onclick="encerrar()">Ainda não</button>
  `;
}

async function continuar() {
  await nucleo.executar(dialogo.reflexao);
  await sleep(2000);
  await nucleo.executar(dialogo.fim);
}

async function encerrar() {
  app.innerHTML = "Tudo tem seu tempo.";
}

iniciar();
