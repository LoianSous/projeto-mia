/* eslint-disable no-restricted-globals */

const VERSION = "mia-v2"; // aumente quando mudar o SW

// BASE_PATH automático baseado no scope do SW:
// - local: scope "/" -> BASE_PATH ""
// - GH Pages: scope "/projeto-mia/" -> BASE_PATH "/projeto-mia"
const BASE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");

const APP_SHELL_CACHE = `${VERSION}-app`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const TILES_CACHE = `${VERSION}-tiles`;
const DATA_CACHE = `${VERSION}-data`;

// Rotas exportadas pelo next export podem existir como pasta ou .html.
// Cachear ambos evita 404 offline dependendo de como a navegação foi gerada.
const APP_SHELL_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,

  `${BASE_PATH}/mapa`,
  `${BASE_PATH}/mapa/`,
  `${BASE_PATH}/mapa.html`,

  `${BASE_PATH}/sobre`,
  `${BASE_PATH}/sobre/`,
  `${BASE_PATH}/sobre.html`,

  // extras do PWA
  `${BASE_PATH}/manifest.webmanifest`,
  `${BASE_PATH}/sw.js`,
];

// --- install: pré-cache do essencial
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_SHELL_CACHE);
      // addAll falha se 1 item der 404; por isso fazemos fetch um a um “tolerante”
      await Promise.all(
        APP_SHELL_URLS.map(async (u) => {
          try {
            const res = await fetch(u, { cache: "no-cache" });
            if (res.ok) await cache.put(u, res);
          } catch {
            // ignora falhas (ex: rota não existe em algum modo)
          }
        })
      );
    })()
  );
  self.skipWaiting();
});

// --- activate: limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("mia-") && !k.startsWith(VERSION))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

// Limite simples para tiles (evita cache infinito)
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxItems) return;
  await Promise.all(keys.slice(0, keys.length - maxItems).map((k) => cache.delete(k)));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // 1) Navegação (HTML): network-first com fallback
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(APP_SHELL_CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          // tenta o HTML exato, senão fallback pra home
          return (
            (await caches.match(req)) ||
            (await caches.match(`${BASE_PATH}/index.html`)) ||
            (await caches.match(`${BASE_PATH}/`)) ||
            new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } })
          );
        }
      })()
    );
    return;
  }

  // 2) Assets do Next export (_next): cache-first
  if (isSameOrigin(url) && url.pathname.includes("/_next/")) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;

        const res = await fetch(req);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(req, res.clone());
        return res;
      })()
    );
    return;
  }

  // 3) CSV / dados: stale-while-revalidate
  // (Papa.parse download:true dispara fetch do csvUrl)
  const looksLikeCsv =
    url.pathname.toLowerCase().endsWith(".csv") ||
    url.searchParams.get("format") === "csv" ||
    req.headers.get("accept")?.includes("text/csv");

  if (looksLikeCsv) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(DATA_CACHE);
        const cached = await cache.match(req);

        const networkPromise = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => null);

        return cached || (await networkPromise) || new Response("", { status: 504 });
      })()
    );
    return;
  }

  // 4) Tiles do OpenStreetMap: cache-first (offline parcial)
  if (url.hostname.endsWith("tile.openstreetmap.org")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(TILES_CACHE);
        const cached = await cache.match(req);
        if (cached) return cached;

        try {
          const res = await fetch(req, { mode: "cors" });
          if (res.ok) {
            cache.put(req, res.clone());
            trimCache(TILES_CACHE, 300);
          }
          return res;
        } catch {
          return cached || new Response("", { status: 504 });
        }
      })()
    );
    return;
  }

  // 5) Outros arquivos do seu domínio: stale-while-revalidate leve
  if (isSameOrigin(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);
        const cached = await cache.match(req);

        const networkPromise = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => null);

        return cached || (await networkPromise) || new Response("", { status: 504 });
      })()
    );
  }
});