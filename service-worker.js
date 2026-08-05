const CACHE = "guardiao-master-v6-1";
const APP_SHELL = [
  "./app/",
  "./app/logo-guardiao.png",
  "./manifest.webmanifest",
  "./icons/guardiao-192.png",
  "./icons/guardiao-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(chaves => Promise.all(
        chaves.filter(chave => chave !== CACHE).map(chave => caches.delete(chave))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Dados de produção nunca ficam presos no cache: novos lotes, rotas,
  // jornadas e arquivos .mind devem ser buscados diretamente da rede.
  const dinamico = /\/(AR\/config\.json|AR\/rotas\/|AR\/targets\/|jornadas\/|js\/)/.test(url.pathname);
  const navegacao = event.request.mode === "navigate";

  if (dinamico || navegacao) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(resposta => {
        const copia = resposta.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copia));
        return resposta;
      })
      .catch(() => caches.match(event.request))
  );
});
