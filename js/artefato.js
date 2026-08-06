/*
======================================================
GUARDIÃO — IDENTIDADE DO ARTEFATO
Versão 7.2 — biblioteca oficial publicada pelo Escriba
======================================================

Fonte principal para códigos atuais:
  AR/config.json
  AR/rotas/*.json

Compatibilidade:
  códigos antigos GRD-MKS-XXXX-XXXX ainda podem ser
  consultados no Supabase.
======================================================
*/

const ArtefatoGuardiao = (() => {

    const CHAVE_LOCAL = "guardiao_artefato_codigo";
    const PARAMETRO_URL = "artefato";
    const CARACTERES = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

    const PADRAO_ATUAL = /^MKS-[A-Z0-9]{5}$/;
    const PADRAO_ANTIGO = /^GRD-MKS-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/;

    let promessaBiblioteca = null;

    function normalizar(codigo) {
        return String(codigo || "").trim().toUpperCase();
    }

    function codigoValido(codigo) {
        const valor = normalizar(codigo);
        return PADRAO_ATUAL.test(valor) || PADRAO_ANTIGO.test(valor);
    }

    function codigoAtual(codigo) {
        return PADRAO_ATUAL.test(normalizar(codigo));
    }

    function obterDaUrl() {
        const parametros = new URLSearchParams(window.location.search);
        return normalizar(parametros.get(PARAMETRO_URL));
    }

    function obterSalvo() {
        try {
            return normalizar(localStorage.getItem(CHAVE_LOCAL));
        } catch (erro) {
            console.warn("Não foi possível ler o Artefato salvo.", erro);
            return "";
        }
    }

    function salvar(codigo) {
        const valor = normalizar(codigo);

        if (!codigoValido(valor)) {
            throw new Error("Código de Artefato inválido.");
        }

        try {
            localStorage.setItem(CHAVE_LOCAL, valor);
        } catch (erro) {
            console.warn("Não foi possível guardar o Artefato neste navegador.", erro);
        }

        return valor;
    }

    function esquecer() {
        try {
            localStorage.removeItem(CHAVE_LOCAL);
        } catch (_) {
            // Nada a fazer.
        }
    }

    function obterCodigoApresentado() {
        const codigoUrl = obterDaUrl();

        if (codigoUrl) {
            return {
                codigo: codigoUrl,
                origem: "url",
                valido: codigoValido(codigoUrl)
            };
        }

        const codigoSalvo = obterSalvo();
        return {
            codigo: codigoSalvo,
            origem: codigoSalvo ? "memoria" : "nenhuma",
            valido: codigoValido(codigoSalvo)
        };
    }

    async function buscarJson(url) {
        const separador = url.includes("?") ? "&" : "?";
        const resposta = await fetch(
            `${url}${separador}v=${Date.now()}`,
            { cache: "no-store" }
        );

        if (!resposta.ok) {
            throw new Error(`Não foi possível carregar ${url} (${resposta.status}).`);
        }

        return resposta.json();
    }

    async function carregarBibliotecaPublicada() {
        if (promessaBiblioteca) {
            return promessaBiblioteca;
        }

        promessaBiblioteca = (async () => {
            const urlConfig = new URL("AR/config.json", window.location.href);
            const config = await buscarJson(urlConfig.toString());
            const lotes = Array.isArray(config?.lotes) ? config.lotes : [];
            const registros = [];

            for (const lote of lotes) {
                if (!lote || !lote.rotas) {
                    continue;
                }

                const urlRotas = new URL(lote.rotas, urlConfig);
                const rotas = await buscarJson(urlRotas.toString());

                if (!Array.isArray(rotas)) {
                    continue;
                }

                for (const rota of rotas) {
                    if (!rota || !rota.codigo) {
                        continue;
                    }

                    registros.push({
                        ...rota,
                        codigo: normalizar(rota.codigo),
                        lote: lote.nome || null
                    });
                }
            }

            return registros;
        })().catch(erro => {
            promessaBiblioteca = null;
            throw erro;
        });

        return promessaBiblioteca;
    }

    async function reconhecerPelasRotas(codigo) {
        const registros = await carregarBibliotecaPublicada();
        const encontrado = registros.find(
            item => normalizar(item.codigo) === normalizar(codigo)
        );

        if (!encontrado) {
            return null;
        }

        salvar(encontrado.codigo);

        return {
            reconhecido: true,
            codigo: encontrado.codigo,
            status: "ativado",
            jornadaId: encontrado.jornadaId || encontrado.jornada_id || null,
            primeiraAtivacao: false,
            origem: "rotas_publicadas",
            lote: encontrado.lote || null,
            targetIndex: Number.isInteger(encontrado.targetIndex)
                ? encontrado.targetIndex
                : null,
            casa: encontrado.casa || null,
            essencia: encontrado.essencia || null,
            assinatura: encontrado.assinatura || null,
            qualidade: encontrado.qualidade ?? null,
            destino: encontrado.destino || null,
            imagem: encontrado.imagem || null
        };
    }

    async function reconhecerNoSupabase(codigo) {
        if (typeof supabaseClient === "undefined") {
            return {
                reconhecido: false,
                motivo: "nao_cadastrado",
                codigo: normalizar(codigo)
            };
        }

        const { data, error } = await supabaseClient.rpc(
            "reconhecer_artefato",
            { p_codigo: normalizar(codigo) }
        );

        if (error) {
            console.error("Erro ao reconhecer Artefato no Supabase:", error);
            return {
                reconhecido: false,
                motivo: "falha_supabase",
                codigo: normalizar(codigo)
            };
        }

        const registro = Array.isArray(data) ? data[0] : data;
        const reconhecido = Boolean(
            registro && (registro.valido === true || registro.reconhecido === true)
        );

        if (!reconhecido) {
            return {
                reconhecido: false,
                motivo: registro?.motivo || "nao_cadastrado",
                codigo: normalizar(codigo)
            };
        }

        salvar(normalizar(codigo));

        return {
            reconhecido: true,
            codigo: registro.codigo || normalizar(codigo),
            status: registro.status || "ativado",
            jornadaId: registro.jornada_id || null,
            primeiraAtivacao: Boolean(registro.primeira_ativacao),
            origem: "supabase"
        };
    }

    async function reconhecer(codigo) {
        const valor = normalizar(codigo);

        if (!codigoValido(valor)) {
            return {
                reconhecido: false,
                motivo: "formato_invalido",
                codigo: valor
            };
        }

        // Os códigos MKS-XXXXX criados pelo Escriba são reconhecidos
        // exclusivamente pela biblioteca publicada em AR/rotas.
        if (codigoAtual(valor)) {
            try {
                const pelasRotas = await reconhecerPelasRotas(valor);

                if (pelasRotas) {
                    return pelasRotas;
                }

                return {
                    reconhecido: false,
                    motivo: "nao_cadastrado",
                    codigo: valor
                };
            } catch (erro) {
                console.error("Erro ao consultar a biblioteca publicada:", erro);
                return {
                    reconhecido: false,
                    motivo: "biblioteca_indisponivel",
                    codigo: valor
                };
            }
        }

        // Compatibilidade com os artefatos antigos.
        return reconhecerNoSupabase(valor);
    }


    /*
     * CAMINHADA LOCAL PARA ARTEFATOS PUBLICADOS PELO ESCRIBA
     *
     * Os códigos MKS-XXXXX são reconhecidos pelos arquivos AR/rotas.
     * O progresso fica separado por código neste navegador. Isso permite
     * que qualquer lote futuro comece no Encontro 1 sem depender de um
     * cadastro adicional no Supabase.
     */
    function idCaminhadaLocal(codigo) {
        return `local-${normalizar(codigo)}`;
    }

    function chaveProgressoLocal(codigo) {
        return `guardiao_progresso_artefato_${normalizar(codigo)}`;
    }

    function lerProgressoLocal(codigo) {
        try {
            const bruto = localStorage.getItem(chaveProgressoLocal(codigo));
            if (!bruto) return null;
            const dados = JSON.parse(bruto);
            return dados && typeof dados === "object" ? dados : null;
        } catch (erro) {
            console.warn("O progresso local do Artefato não pôde ser lido.", erro);
            return null;
        }
    }

    function gravarProgressoLocal(codigo, progresso) {
        try {
            localStorage.setItem(
                chaveProgressoLocal(codigo),
                JSON.stringify(progresso && typeof progresso === "object" ? progresso : {})
            );
            return true;
        } catch (erro) {
            console.warn("O progresso do Artefato não pôde ser salvo neste navegador.", erro);
            return false;
        }
    }

    async function ativarNovaCaminhada(codigo, memoriaInicial = {}) {
        const valor = normalizar(codigo);

        if (!codigoValido(valor)) {
            return { ok: false, motivo: "formato_invalido", codigo: valor };
        }

        const existente = lerProgressoLocal(valor);
        if (!existente) {
            gravarProgressoLocal(valor, memoriaInicial || {});
        }

        return {
            ok: true,
            caminhada_id: idCaminhadaLocal(valor),
            codigo: valor,
            criada: !existente
        };
    }

    async function carregarProgresso(codigo) {
        const valor = normalizar(codigo);

        if (!codigoValido(valor)) {
            return { ok: false, motivo: "formato_invalido", codigo: valor };
        }

        const progresso = lerProgressoLocal(valor);

        return {
            ok: true,
            caminhada_id: idCaminhadaLocal(valor),
            codigo: valor,
            existe: Boolean(progresso),
            progresso: progresso || {}
        };
    }

    async function salvarProgresso(codigo, progresso) {
        const valor = normalizar(codigo);

        if (!codigoValido(valor)) {
            return { ok: false, motivo: "formato_invalido", codigo: valor };
        }

        const salvo = gravarProgressoLocal(valor, progresso || {});
        return {
            ok: salvo,
            motivo: salvo ? null : "armazenamento_indisponivel",
            caminhada_id: idCaminhadaLocal(valor),
            codigo: valor
        };
    }

    function gerarCodigo() {
        const bytes = new Uint32Array(5);
        crypto.getRandomValues(bytes);

        const aleatorio = Array.from(
            bytes,
            valor => CARACTERES[valor % CARACTERES.length]
        ).join("");

        return `MKS-${aleatorio}`;
    }

    function criarLink(codigo, base = null) {
        const valor = normalizar(codigo);

        if (!codigoValido(valor)) {
            throw new Error("Não é possível criar um link com código inválido.");
        }

        const url = base
            ? new URL(base, window.location.href)
            : new URL(window.location.href);

        url.search = "";
        url.hash = "";
        url.searchParams.set(PARAMETRO_URL, valor);
        return url.toString();
    }

    return {
        normalizar,
        codigoValido,
        obterCodigoApresentado,
        reconhecer,
        gerarCodigo,
        criarLink,
        esquecer,
        carregarBibliotecaPublicada,
        ativarNovaCaminhada,
        carregarProgresso,
        salvarProgresso
    };

})();

window.ArtefatoGuardiao = ArtefatoGuardiao;
