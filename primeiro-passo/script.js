(() => {
  const marca = document.getElementById('marca');
  const ornamento = document.getElementById('ornamento');
  const titulo = document.getElementById('titulo');
  const fala = document.getElementById('fala');

  const roteiro = [
    { texto: 'Todos nós estamos caminhando.', tempo: 3400 },
    { texto: 'A diferença é que cada pessoa escolhe como deseja percorrer esse caminho.', tempo: 4600 },
    { texto: 'Alguns apenas deixam os dias passarem.', tempo: 3600 },
    { texto: 'Outros escolhem crescer por meio das experiências, das reflexões e das escolhas feitas ao longo da vida.', tempo: 5200 },
    { texto: 'O Guardião nasceu para acompanhar essa caminhada.', tempo: 4200 },
    { texto: 'Ele não oferece respostas prontas.', tempo: 3300 },
    { texto: 'Nem pretende dizer como você deve viver.', tempo: 3600 },
    { texto: 'Apenas reserva alguns instantes para uma pergunta, uma reflexão ou um momento de silêncio.', tempo: 5000 },
    { texto: 'Porque nenhuma caminhada é construída por um único passo.', tempo: 4400 },
    { texto: 'Ela acontece, pouco a pouco, um dia de cada vez.', tempo: 4400 },
    { texto: 'Imagine que este seja o primeiro passo de uma longa caminhada.', tempo: 5000 },
    { texto: 'Às vezes, seguimos em frente sem perceber o que estamos levando conosco.', tempo: 5000 },
    { texto: 'Agora, pense por alguns instantes:', tempo: 3400 },
    { texto: 'Qual pequeno passo poderia tornar o seu caminho de amanhã um pouco mais consciente?', tempo: 7200 },
    { texto: 'Esta foi apenas uma breve demonstração.', tempo: 3900 },
    { texto: 'A verdadeira caminhada começa quando você decide continuar.', tempo: 5200 },
    { texto: 'Seja bem-vindo.', tempo: 5200 }
  ];

  const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function aparecer(elemento, esperaAntes = 0, permanencia = 1200) {
    await esperar(esperaAntes);
    elemento.classList.remove('oculto');
    elemento.classList.add('visivel');
    await esperar(permanencia);
  }

  async function trocarTexto(item) {
    fala.classList.remove('visivel');
    fala.classList.add('oculto');
    await esperar(900);
    fala.textContent = item.texto;
    fala.classList.remove('oculto');
    fala.classList.add('visivel');
    await esperar(item.tempo);
  }

  async function iniciar() {
    await aparecer(marca, 700, 1200);
    await aparecer(ornamento, 200, 900);
    await aparecer(titulo, 200, 2200);

    titulo.classList.remove('visivel');
    titulo.classList.add('oculto');
    ornamento.classList.remove('visivel');
    ornamento.classList.add('oculto');
    await esperar(1100);

    for (const item of roteiro) {
      await trocarTexto(item);
    }

    fala.classList.remove('visivel');
    fala.classList.add('oculto');
    await esperar(1400);
    ornamento.classList.remove('oculto');
    ornamento.classList.add('visivel');
  }

  iniciar();
})();
