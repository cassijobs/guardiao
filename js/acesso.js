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
            .acesso-guardiao button{width:100%;box-sizing:border-box;margin-top:12px;padding:13px 16px;border-radius:999px;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;cursor:pointer}
            .acesso-guardiao button.secundario-botao{border-color:rgba(255,255,255,.28);opacity:.82}
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

    function mostrarLogin(app, codigo) {
        return new Promise(resolve => {
            app.innerHTML = `${estilos()}
                <section class="acesso-guardiao">
                    <h2>Entre para encontrar seu Guardião</h2>
                    <p>Sua conta protege esta caminhada quando o link é aberto em outro aparelho.</p>
                    <label for="guardiaoEmail">E-mail</label>
                    <input id="guardiaoEmail" type="email" inputmode="email" autocomplete="email">
                    <label for="guardiaoSenha">Senha</label>
                    <input id="guardiaoSenha" type="password" autocomplete="current-password" minlength="8">
                    <button id="guardiaoEntrar" type="button">Entrar</button>
                    <button id="guardiaoCriarConta" class="secundario-botao" type="button">Criar minha conta</button>
                    <p id="guardiaoErro" class="erro" role="status" aria-live="polite"></p>
                    <p class="codigo">${escapar(codigo)}</p>
                </section>`;

            const email = document.getElementById("guardiaoEmail");
            const senha = document.getElementById("guardiaoSenha");
            const entrar = document.getElementById("guardiaoEntrar");
            const criar = document.getElementById("guardiaoCriarConta");
            const mensagem = document.getElementById("guardiaoErro");
            const botoes = [entrar, criar];

            function valoresValidos(exigirSenha = true) {
                const e = email.value.trim();
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
                    const { data, error } = await cliente().auth.signInWithPassword(credenciais);
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
