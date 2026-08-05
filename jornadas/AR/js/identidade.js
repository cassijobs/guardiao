const CASAS = ["Aurora", "Caminho", "Silêncio", "Chama", "Água", "Montanha", "Lua", "Horizonte"];
const ESSENCIAS = ["Origem", "Passagem", "Escolha", "Memória", "Transformação"];

function hash(texto) {
  let h = 2166136261;
  for (const caractere of texto) {
    h ^= caractere.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function identidadeDaRota(rota) {
  const h = hash(rota.codigo || "GUARDIAO");
  return {
    casa: rota.casa || CASAS[h % CASAS.length],
    essencia: rota.essencia || ESSENCIAS[(h >>> 5) % ESSENCIAS.length]
  };
}
