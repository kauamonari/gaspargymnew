const CACHE_NAME = "gaspargym-v2";
const FONT_ORIGINS = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

function cacheFirst(request) {
  return caches.open(CACHE_NAME).then((cache) =>
    cache.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        }),
    ),
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Fontes do Google (CSS + arquivos .woff2) — cross-origin, mas efetivamente
  // imutáveis, então cache-first também funciona bem offline. Sem isso, a
  // fonte customizada simplesmente falha em silêncio quando offline (cai pra
  // fonte do sistema — não quebra, mas fica inconsistente entre sessões).
  if (FONT_ORIGINS.includes(url.origin)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Assets com hash no nome (gerados pelo build) e ícones — cache-first,
  // são imutáveis (o nome muda se o conteúdo mudar).
  if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navegação (abrir uma página) — sempre tenta a rede primeiro (dados
  // mudam), só usa cache/offline como último recurso. Sem conexão E sem essa
  // página em cache ainda, cai pro "/" em cache (app shell) em vez de dar
  // erro de rede cru — degrada com uma tela conhecida, não uma tela branca.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, res.clone()));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/"))),
    );
  }
});
