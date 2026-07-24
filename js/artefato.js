/*
======================================================
GUARDIÃO — IDENTIDADE DO ARTEFATO
Mega Kraft Studio
======================================================

Reconhece códigos no padrão:
GRD-MKS-XXXX-XXXX

O código chega pela URL gravada na tag NFC:
?artefato=GRD-MKS-8F4Q-X72P
======================================================
*/

const ArtefatoGuardiao = (() => {

    const CHAVE_LOCAL = "guardiao_artefato_codigo";
    const PARAMETRO_URL = "artefato";
    const CARACTERES = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
    const PADRAO = /^GRD-MKS-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/;

    function normalizar(codigo) {
        return String(codigo || "")
            .trim()
            .toUpperCase();
    }

    function codigoValido(codigo) {
        return PADRAO.test(normalizar(codigo));
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
        const normalizado = normalizar(codigo);

        if (!codigoValido(normalizado)) {
            throw new Error("Código de Artefato inválido.");
        }

        localStorage.setItem(CHAVE_LOCAL, normalizado);
        return normalizado;
    }

    function esquecer() {
        localStorage.removeItem(CHAVE_LOCAL);
    }

    function obterCodigoApresentado() {
        const codigoUrl = obterDaUrl();

        if (codigoUrl) {
            if (!codigoValido(codigoUrl)) {
                return {
                    codigo: codigoUrl,
                    origem: "url",
                    valido: false
                };
            }

            salvar(codigoUrl);

            return {
                codigo: codigoUrl,
                origem: "url",
                valido: true
            };
        }

        const codigoSalvo = obterSalvo();

        return {
            codigo: codigoSalvo,
            origem: codigoSalvo ? "memoria" : "nenhuma",
            valido: codigoValido(codigoSalvo)
        };
    }

    async function reconhecer(codigo) {
        const normalizado = normalizar(codigo);

        if (!codigoValido(normalizado)) {
            return {
                reconhecido: false,
                motivo: "formato_invalido",
                codigo: normalizado
            };
        }

        if (typeof supabaseClient === "undefined") {
            throw new Error("A conexão com o Supabase não foi carregada.");
        }

        const { data, error } = await supabaseClient.rpc(
            "reconhecer_artefato",
            { codigo_informado: normalizado }
        );

        if (error) {
            console.error("Erro ao reconhecer Artefato:", error);
            throw new Error(
                error.message || "Não foi possível reconhecer o Artefato."
            );
        }

        const registro = Array.isArray(data) ? data[0] : data;

        if (!registro || registro.reconhecido !== true) {
            return {
                reconhecido: false,
                motivo: registro?.motivo || "nao_cadastrado",
                codigo: normalizado
            };
        }

        salvar(normalizado);

        return {
            reconhecido: true,
            codigo: normalizado,
            status: registro.status || "ativo",
            primeiraAtivacao: Boolean(registro.primeira_ativacao)
        };
    }

    function gerarCodigo() {
        const bytes = new Uint32Array(8);
        crypto.getRandomValues(bytes);

        const aleatorio = Array.from(bytes, valor =>
            CARACTERES[valor % CARACTERES.length]
        ).join("");

        return `GRD-MKS-${aleatorio.slice(0, 4)}-${aleatorio.slice(4, 8)}`;
    }

    function criarLink(codigo, base = null) {
        const normalizado = normalizar(codigo);

        if (!codigoValido(normalizado)) {
            throw new Error("Não é possível criar um link com código inválido.");
        }

        const url = base
            ? new URL(base, window.location.href)
            : new URL(window.location.href);

        url.search = "";
        url.hash = "";
        url.searchParams.set(PARAMETRO_URL, normalizado);

        return url.toString();
    }

    return {
        normalizar,
        codigoValido,
        obterCodigoApresentado,
        reconhecer,
        gerarCodigo,
        criarLink,
        esquecer
    };

})();

window.ArtefatoGuardiao = ArtefatoGuardiao;
