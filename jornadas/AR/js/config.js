export const CAMINHO_CONFIG = "./config.json";

export async function carregarConfiguracao() {
  const resposta = await fetch(CAMINHO_CONFIG, { cache: "no-store" });
  if (!resposta.ok) throw new Error("Não foi possível carregar o arquivo config.json.");
  const config = await resposta.json();
  if (!Array.isArray(config.lotes) || config.lotes.length === 0) {
    throw new Error("Nenhum lote foi publicado no leitor.");
  }
  return config;
}

export async function carregarRotas(lote) {
  const resposta = await fetch(lote.rotas, { cache: "no-store" });
  if (!resposta.ok) throw new Error(`Não foi possível carregar as rotas do lote “${lote.nome}”.`);
  const rotas = await resposta.json();
  if (!Array.isArray(rotas) || rotas.length === 0) {
    throw new Error(`O lote “${lote.nome}” não possui artefatos publicados.`);
  }
  return rotas;
}
