/*
======================================================
GUARDIÃO v6.0 — ACESSO SEGURO DO PROPRIETÁRIO
======================================================
- A sessão é mantida pelo Supabase Auth neste aparelho.
- A primeira vinculação exige a chave secreta da embalagem.
- Nenhum segredo ou senha é salvo por este módulo.
======================================================
*/

const AcessoGuardiao = (() => {
    function cliente() {
        if (!window.supabaseClient?.auth || !window.supabaseClient?.rpc) {
            throw new Error("A conexão segura com o Guardião não está disponível.");
        }
        return window.supabaseClient;
    }

    function escapar(valor) {
        return String(valor ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function normalizarChave(valor) {
        return String(valor || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 32);
    }

    function estilos() {
        return `<style>
            .acesso-guardiao{width:min(92vw,430px);margin:7vh auto 0;text-align:center}
            .acesso-guardiao h2{margin:0 0 16px;font-size:1.45rem;font-weight:500}
            .acesso-guardiao p{margin:0 0 18px;line-height:1.55}
            .acesso-guardiao .secundario{opacity:.72;font-size:.94rem}
            .acesso-guardiao label{display:block;text-align:left;margin:12px 3px 5px;font-size:.9rem}
            .acesso-guardiao input{width:100%;box-sizing:border-box;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.24);background:rgba(255,255,255,.06);color:inherit;font:inherit;outline:none}
            .acesso-guardiao input:focus{border-color:currentColor}
            .acesso-guardiao .campo-senha{position:relative}
            .acesso-guardiao .campo-senha input{padding-right:52px}
            .acesso-guardiao button.alternar-senha{position:absolute;right:5px;top:50%;transform:translateY(-50%);width:42px;height:42px;margin:0;padding:0;border:0;border-radius:50%;font-size:1.05rem;opacity:.78}
            .acesso-guardiao button{width:100%;box-sizing:border-box;margin-top:12px;padding:13px 16px;border-radius:999px;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;cursor:pointer}
            .acesso-guardiao button.secundario-botao{border-color:rgba(255,255,255,.28);opacity:.82}
            .acesso-guardiao button.link-botao{width:auto;margin:12px auto 2px;padding:5px 8px;border:0;border-radius:0;opacity:.8;text-decoration:underline;text-underline-offset:3px}
            .acesso-guardiao .confirmar-senha{margin-top:4px}
            .acesso-guardiao button:disabled{cursor:wait;opacity:.55}
            .acesso-guardiao .erro{min-height:1.4em;margin-top:14px;font-size:.92rem}
            .acesso-guardiao .codigo{opacity:.58;font-size:.78rem;letter-spacing:.08em;margin-top:22px}
            .acesso-guardiao .chave{letter-spacing:.18em;text-align:center;text-transform:uppercase}
        </style>`;
    }

    async function sessaoAtual() {
        const { data, error } = await cliente().auth.getSession();
        if (error) throw error;
        return data?.session || null;
    }

    function retornoRecuperacao() {
        return new URL("redefinir-senha.html", document.baseURI).toString();
    }

    function veioDeRecuperacao() {
        return new URLSearchParams(window.location.hash.replace(/^#/, "")).get("type") === "recovery";
    }

    function emailAlternativoGmail(email) {
        const valor = String(email || "").trim().toLowerCase();
        const partes = valor.split("@");
        if (partes.length !== 2 || !["gmail.com", "googlemail.com"].includes(partes[1])) return "";
        const semPontos = partes[0].split("+")[0].replaceAll(".", "");
        const alternativo = `${semPontos}@gmail.com`;
        return alternativo === valor ? "" : alternativo;
    }

    function campoSenha(id, autocomplete, classe = "") {
        return `<div class="campo-senha">
            <input id="${id}" class="${classe}" type="password" autocomplete="${autocomplete}" minlength="8">
            <button class="alternar-senha" type="button" aria-label="Mostrar senha" aria-pressed="false" data-alvo="${id}">👁</button>
        </div>`;
    }

    function ativarVisualizacaoSenhas(raiz) {
        raiz.querySelectorAll(".alternar-senha").forEach(botao => {
            botao.addEventListener("click", () => {
                const campo = document.getElementById(botao.dataset.alvo);
                const mostrar = campo.type === "password";
                campo.type = mostrar ? "text" : "password";
                botao.setAttribute("aria-pressed", String(mostrar));
                botao.setAttribute("aria-label", mostrar ? "Ocultar senha" : "Mostrar senha");
            });
        });
    }

    function mostrarNovaSenha(app) {
        return new Promise(resolve => {
            app.innerHTML = `${estilos()}
                <section class="acesso-guardiao">
                    <h2>Crie uma nova senha</h2>
                    <p>Escolha uma nova senha para reencontrar seu Guardião com segurança.</p>
                    <label for="guardiaoNovaSenha">Nova senha</label>
                    ${campoSenha("guardiaoNovaSenha", "new-password")}
                    <label for="guardiaoConfirmarSenha">Confirmar nova senha</label>
                    ${campoSenha("guardiaoConfirmarSenha", "new-password", "confirmar-senha")}
                    <button id="guardiaoSalvarSenha" type="button">Salvar nova senha</button>
                    <p id="guardiaoErro" class="erro" role="status" aria-live="polite"></p>
                </section>`;

            ativarVisualizacaoSenhas(app);

            const senha = document.getElementById("guardiaoNovaSenha");
            const confirmar = document.getElementById("guardiaoConfirmarSenha");
            const salvar = document.getElementById("guardiaoSalvarSenha");
            const mensagem = document.getElementById("guardiaoErro");
            salvar.addEventListener("click", async () => {
                mensagem.textContent = "";
                if (senha.value.length < 8) {
                    mensagem.textContent = "A senha precisa ter pelo menos 8 caracteres.";
                    senha.focus();
                    return;
                }
                if (senha.value !== confirmar.value) {
                    mensagem.textContent = "As duas senhas não são iguais.";
                    confirmar.focus();
                    return;
                }
                salvar.disabled = true;
                salvar.textContent = "Salvando...";
                const { error } = await cliente().auth.updateUser({ password: senha.value });
                if (error) {
                    mensagem.textContent = "O link pode ter expirado. Solicite uma nova recuperação.";
                    salvar.disabled = false;
                    salvar.textContent = "Salvar nova senha";
                    return;
                }
                history.replaceState(null, "", window.location.pathname + window.location.search);
                mensagem.textContent = "Senha atualizada. Reabrindo seu Guardião...";
                setTimeout(() => resolve(true), 900);
            });
            confirmar.addEventListener("keydown", evento => { if (evento.key === "Enter") salvar.click(); });
            senha.focus();
        });
    }

    function mostrarLogin(app, codigo) {
        return new Promise(resolve => {
            app.innerHTML = `${estilos()}
                <section class="acesso-guardiao">
                    <h2>Entre para encontrar seu Guardião</h2>
                    <p>Sua conta protege esta caminhada quando o link é aberto em outro aparelho.</p>
                    <label for="guardiaoEmail">E-mail</label>
                    <input id="guardiaoEmail" type="email" inputmode="email" autocomplete="email">
                    <label for="guardiaoSenha">Senha</label>
                    ${campoSenha("guardiaoSenha", "current-password")}
                    <button id="guardiaoEntrar" type="button">Entrar</button>
                    <button id="guardiaoEsqueciSenha" class="link-botao" type="button">Esqueci minha senha</button>
                    <button id="guardiaoCriarConta" class="secundario-botao" type="button">Criar minha conta</button>
                    <p id="guardiaoErro" class="erro" role="status" aria-live="polite"></p>
                    <p class="codigo">${escapar(codigo)}</p>
                </section>`;

            ativarVisualizacaoSenhas(app);

            const email = document.getElementById("guardiaoEmail");
            const senha = document.getElementById("guardiaoSenha");
            const entrar = document.getElementById("guardiaoEntrar");
            const esqueci = document.getElementById("guardiaoEsqueciSenha");
            const criar = document.getElementById("guardiaoCriarConta");
            const mensagem = document.getElementById("guardiaoErro");
            const botoes = [entrar, esqueci, criar];

            function valoresValidos(exigirSenha = true) {
                const e = email.value.trim().toLowerCase();
                const s = senha.value;
                mensagem.textContent = "";
                if (!/^\S+@\S+\.\S+$/.test(e)) {
                    mensagem.textContent = "Digite um e-mail válido.";
                    email.focus();
                    return null;
                }
                if (exigirSenha && s.length < 8) {
                    mensagem.textContent = "A senha precisa ter pelo menos 8 caracteres.";
                    senha.focus();
                    return null;
                }
                return { email: e, password: s };
            }

            function ocupando(sim, texto = "Aguarde...") {
                botoes.forEach(botao => { botao.disabled = sim; });
                entrar.textContent = sim ? texto : "Entrar";
            }

            entrar.addEventListener("click", async () => {
                const credenciais = valoresValidos();
                if (!credenciais) return;
                ocupando(true, "Entrando...");
                try {
                    let { data, error } = await cliente().auth.signInWithPassword(credenciais);
                    const alternativo = error?.message === "Invalid login credentials"
                        ? emailAlternativoGmail(credenciais.email)
                        : "";
                    if (alternativo) {
                        ({ data, error } = await cliente().auth.signInWithPassword({
                            email: alternativo,
                            password: credenciais.password
                        }));
                    }
                    if (error) throw error;
                    if (!data?.session) throw new Error("A sessão não foi criada.");
                    resolve(data.session);
                } catch (erro) {
                    mensagem.textContent = erro?.message === "Invalid login credentials"
                        ? "E-mail ou senha não reconhecidos."
                        : "Não foi possível entrar agora.";
                    ocupando(false);
                }
            });

            esqueci.addEventListener("click", async () => {
                const credenciais = valoresValidos(false);
                if (!credenciais) return;
                ocupando(true, "Enviando...");
                try {
                    const emailRecuperacao = emailAlternativoGmail(credenciais.email) || credenciais.email;
                    const { error } = await cliente().auth.resetPasswordForEmail(emailRecuperacao, {
                        redirectTo: retornoRecuperacao()
                    });
                    if (error) throw error;
                    mensagem.textContent = "Se este e-mail estiver cadastrado, enviaremos as instruções para redefinir sua senha. Confira também o Spam.";
                } catch (_) {
                    mensagem.textContent = "Não foi possível enviar agora. Aguarde um pouco e tente novamente.";
                } finally {
                    ocupando(false);
                }
            });

            criar.addEventListener("click", async () => {
                const credenciais = valoresValidos();
                if (!credenciais) return;
                ocupando(true, "Criando conta...");
                try {
                    const retorno = new URL(window.location.href);
                    retorno.hash = "";
                    const { data, error } = await cliente().auth.signUp({
                        ...credenciais,
                        options: { emailRedirectTo: retorno.toString() }
                    });
                    if (error) throw error;
                    if (data?.session) {
                        resolve(data.session);
                        return;
                    }
                    mensagem.textContent = "Enviamos uma confirmação para seu e-mail. Depois de confirmar, volte aqui e entre com sua senha.";
                } catch (erro) {
                    mensagem.textContent = erro?.message || "Não foi possível criar a conta.";
                } finally {
                    ocupando(false);
                }
            });

            senha.addEventListener("keydown", evento => {
                if (evento.key === "Enter") entrar.click();
            });
            email.focus();
        });
    }

    async function chamarRpc(nome, parametros) {
        const { data, error } = await cliente().rpc(nome, parametros);
        if (error) {
            console.error(`Erro em ${nome}:`, error);
            throw new Error(error.message || "O acesso não pôde ser confirmado.");
        }
        return Array.isArray(data) ? (data[0] || {}) : (data || {});
    }

    function mostrarVinculacao(app, codigo, email) {
        return new Promise(resolve => {
            app.innerHTML = `${estilos()}
                <section class="acesso-guardiao">
                    <h2>Confirme seu Artefato</h2>
                    <p>Digite a chave secreta encontrada no interior da embalagem.</p>
                    <p class="secundario">Ela é usada somente nesta primeira vinculação.</p>
                    <label for="guardiaoChave">Chave secreta</label>
                    <input id="guardiaoChave" class="chave" type="text" inputmode="text" autocomplete="one-time-code" maxlength="19" placeholder="XXXX-XXXX-XXXX-XXXX">
                    <button id="guardiaoVincular" type="button">Vincular à minha conta</button>
                    <button id="guardiaoTrocarConta" class="secundario-botao" type="button">Usar outra conta</button>
                    <p id="guardiaoErro" class="erro" role="status" aria-live="polite"></p>
                    <p class="codigo">${escapar(codigo)} · ${escapar(email || "conta autenticada")}</p>
                </section>`;

            const chave = document.getElementById("guardiaoChave");
            const vincular = document.getElementById("guardiaoVincular");
            const trocar = document.getElementById("guardiaoTrocarConta");
            const mensagem = document.getElementById("guardiaoErro");

            chave.addEventListener("input", () => {
                const limpa = normalizarChave(chave.value);
                chave.value = limpa.match(/.{1,4}/g)?.join("-") || limpa;
                mensagem.textContent = "";
            });

            vincular.addEventListener("click", async () => {
                const segredo = normalizarChave(chave.value);
                if (segredo.length !== 16) {
                    mensagem.textContent = "Digite os 16 caracteres da chave secreta.";
                    chave.focus();
                    return;
                }
                vincular.disabled = true;
                vincular.textContent = "Vinculando...";
                try {
                    const resposta = await chamarRpc("vincular_guardiao_seguro", {
                        p_codigo: codigo,
                        p_chave: segredo
                    });
                    if (resposta.ok === true) {
                        resolve(true);
                        return;
                    }
                    mensagem.textContent = resposta.mensagem || "A chave secreta não foi reconhecida.";
                    chave.value = "";
                    chave.focus();
                } catch (_) {
                    mensagem.textContent = "Não foi possível confirmar o Artefato agora.";
                } finally {
                    vincular.disabled = false;
                    vincular.textContent = "Vincular à minha conta";
                }
            });

            trocar.addEventListener("click", async () => {
                await cliente().auth.signOut();
                window.location.reload();
            });
            chave.addEventListener("keydown", evento => {
                if (evento.key === "Enter") vincular.click();
            });
            chave.focus();
        });
    }

    function mostrarNegado(app, codigo) {
        app.innerHTML = `${estilos()}
            <section class="acesso-guardiao">
                <h2>Este Guardião já encontrou quem acompanha</h2>
                <p>Entre com a conta vinculada a este Artefato para continuar a caminhada.</p>
                <button id="guardiaoOutraConta" type="button">Entrar com outra conta</button>
                <p class="codigo">${escapar(codigo)}</p>
            </section>`;
        document.getElementById("guardiaoOutraConta").addEventListener("click", async () => {
            await cliente().auth.signOut();
            window.location.reload();
        });
        return false;
    }

    async function garantirAcesso(app, codigo) {
        if (veioDeRecuperacao()) {
            const atualizou = await mostrarNovaSenha(app);
            if (!atualizou) return false;
        }
        let sessao = await sessaoAtual();
        if (!sessao) sessao = await mostrarLogin(app, codigo);
        if (!sessao?.user) return false;

        let estado = await chamarRpc("status_acesso_guardiao", { p_codigo: codigo });
        if (estado.autorizado === true) return true;

        if (estado.precisa_chave === true) {
            const vinculou = await mostrarVinculacao(app, codigo, sessao.user.email);
            if (!vinculou) return false;
            estado = await chamarRpc("status_acesso_guardiao", { p_codigo: codigo });
            return estado.autorizado === true;
        }

        return mostrarNegado(app, codigo);
    }

    async function sair() {
        await cliente().auth.signOut();
        window.location.reload();
    }

    return { garantirAcesso, sair, sessaoAtual };
})();

window.AcessoGuardiao = AcessoGuardiao;
