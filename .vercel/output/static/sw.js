self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;
  if (!/\.(png|jpe?g|webp|svg|css|woff2)$/.test(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open("alkhadher-static");
    const hit = await cache.match(event.request);
    if (hit) return hit;
    const response = await fetch(event.request);
    if (response.ok) cache.put(event.request, response.clone());
    return response;
  })());
});
