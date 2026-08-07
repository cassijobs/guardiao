/* GUARDIÃO — STUDIO 10.6 — ACESSO LOCAL PROTEGIDO */
(() => {
  "use strict";

  const CHAVE_CREDENCIAL = "escriba_auth_v1";
  const CHAVE_PERSISTENTE = "escriba_auth_conectado_v1";
  const CHAVE_SESSAO = "escriba_auth_sessao_v1";

  const $ = id => document.getElementById(id);
  const tela = $("telaLoginStudio");
  const app = $("studioAplicacao");
  const form = $("formLoginStudio");
  const senha = $("senhaStudio");
  const confirmar = $("confirmarSenhaStudio");
  const blocoConfirmar = $("campoConfirmarSenha");
  const lembrar = $("lembrarStudio");
  const texto = $("loginTexto");
  const titulo = $("loginTitulo");
  const erro = $("loginStudioErro");
  const ajuda = $("loginStudioAjuda");
  const botao = $("entrarStudio");

  function bytesParaBase64(bytes) {
    let binario = "";
    bytes.forEach(byte => binario += String.fromCharCode(byte));
    return btoa(binario);
  }

  function base64ParaBytes(valor) {
    const binario = atob(valor);
    return Uint8Array.from(binario, caractere => caractere.charCodeAt(0));
  }

  async function derivarHash(valor, salt) {
    if (!window.crypto?.subtle) {
      throw new Error("Este navegador não oferece a proteção necessária para a senha.");
    }
    const chave = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(valor),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations: 180000, hash: "SHA-256" },
      chave,
      256
    );
    return bytesParaBase64(new Uint8Array(bits));
  }

  function lerCredencial() {
    try {
      const valor = localStorage.getItem(CHAVE_CREDENCIAL);
      return valor ? JSON.parse(valor) : null;
    } catch (_) {
      return null;
    }
  }

  function jaAutenticado() {
    try {
      return localStorage.getItem(CHAVE_PERSISTENTE) === "1" ||
             sessionStorage.getItem(CHAVE_SESSAO) === "1";
    } catch (_) {
      return false;
    }
  }

  function liberarStudio() {
    document.body.classList.remove("studio-bloqueado");
    tela.hidden = true;
    app.setAttribute("aria-hidden", "false");
    erro.textContent = "";
  }

  function bloquearStudio() {
    try {
      localStorage.removeItem(CHAVE_PERSISTENTE);
      sessionStorage.removeItem(CHAVE_SESSAO);
    } catch (_) {}
    document.body.classList.add("studio-bloqueado");
    app.setAttribute("aria-hidden", "true");
    tela.hidden = false;
    configurarTela();
    senha.value = "";
    confirmar.value = "";
    setTimeout(() => senha.focus(), 60);
  }

  function configurarTela() {
    const primeiraVez = !lerCredencial();
    blocoConfirmar.hidden = !primeiraVez;
    confirmar.required = primeiraVez;
    senha.autocomplete = primeiraVez ? "new-password" : "current-password";
    titulo.textContent = primeiraVez ? "CRIAR SENHA" : "O ESCRIBA";
    texto.textContent = primeiraVez
      ? "Crie a senha que será usada para entrar no Studio neste navegador."
      : "Digite sua senha para entrar no Studio.";
    botao.textContent = primeiraVez ? "CRIAR SENHA E ENTRAR" : "ENTRAR";
    ajuda.textContent = primeiraVez
      ? "Guarde esta senha. Para redefini-la, será necessário limpar os dados deste site no navegador."
      : "Marque “Permanecer conectado” para abrir diretamente neste dispositivo.";
    erro.textContent = "";
  }

  async function criarCredencial(valor) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await derivarHash(valor, salt);
    localStorage.setItem(CHAVE_CREDENCIAL, JSON.stringify({
      versao: 1,
      salt: bytesParaBase64(salt),
      hash
    }));
  }

  async function senhaCorreta(valor, credencial) {
    const hash = await derivarHash(valor, base64ParaBytes(credencial.salt));
    return hash === credencial.hash;
  }

  form?.addEventListener("submit", async evento => {
    evento.preventDefault();
    erro.textContent = "";
    botao.disabled = true;

    try {
      const valor = senha.value;
      const credencial = lerCredencial();

      if (!credencial) {
        if (valor.length < 6) {
          throw new Error("Use uma senha com pelo menos 6 caracteres.");
        }
        if (valor !== confirmar.value) {
          throw new Error("As duas senhas não são iguais.");
        }
        await criarCredencial(valor);
      } else if (!(await senhaCorreta(valor, credencial))) {
        throw new Error("Senha incorreta.");
      }

      if (lembrar.checked) {
        localStorage.setItem(CHAVE_PERSISTENTE, "1");
        sessionStorage.removeItem(CHAVE_SESSAO);
      } else {
        sessionStorage.setItem(CHAVE_SESSAO, "1");
        localStorage.removeItem(CHAVE_PERSISTENTE);
      }

      liberarStudio();
    } catch (falha) {
      erro.textContent = falha.message || "Não foi possível entrar.";
      senha.select();
    } finally {
      botao.disabled = false;
    }
  });

  $("sairStudio")?.addEventListener("click", bloquearStudio);

  configurarTela();
  if (jaAutenticado() && lerCredencial()) {
    liberarStudio();
  } else {
    tela.hidden = false;
    setTimeout(() => senha.focus(), 60);
  }
})();
