const porId = id => document.getElementById(id);

export const UI = {
  inicial: porId("telaInicial"),
  interface: porId("interface"),
  iniciar: porId("iniciarLeitor"),
  mensagemInicial: porId("mensagemInicial"),
  status: porId("status"),
  moldura: porId("moldura"),
  trocarLote: porId("trocarLote"),
  seletor: porId("seletorLote"),
  fecharLotes: porId("fecharLotes"),
  listaLotes: porId("listaLotes"),
  ritual: porId("ritual"),
  ritualSelo: porId("ritualSelo"),
  ritualEstado: porId("ritualEstado"),
  ritualCodigo: porId("ritualCodigo"),
  ritualMensagem: porId("ritualMensagem"),
  ritualIdentidade: porId("ritualIdentidade"),
  erro: porId("erro"),
  cena: porId("cena")
};

export function mostrarInicial(mensagem) {
  UI.inicial.classList.remove("oculto");
  UI.interface.classList.add("oculto");
  if (mensagem) UI.mensagemInicial.textContent = mensagem;
  UI.iniciar.disabled = false;
}

export function mostrarLeitor() {
  UI.inicial.classList.add("oculto");
  UI.interface.classList.remove("oculto");
}

export function definirStatus(texto, estado = "") {
  UI.status.textContent = texto;
  UI.status.dataset.estado = estado;
}

export function mostrarErro(mensagem, duracao = 5000) {
  UI.erro.textContent = mensagem;
  UI.erro.classList.remove("oculto");
  clearTimeout(mostrarErro.timer);
  mostrarErro.timer = setTimeout(() => UI.erro.classList.add("oculto"), duracao);
}

export function preencherLotes(lotes, selecionar) {
  UI.listaLotes.innerHTML = "";
  lotes.forEach(lote => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.innerHTML = `<strong>${lote.nome}</strong><span>${lote.quantidade ?? "—"} símbolo(s)</span>`;
    botao.addEventListener("click", () => selecionar(lote.nome));
    UI.listaLotes.appendChild(botao);
  });
  UI.seletor.classList.remove("oculto");
}

export function fecharSeletor() {
  UI.seletor.classList.add("oculto");
}
