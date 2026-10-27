const CACHE='vap-et-moi-ultima-cache-v59-3';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./mascotte-vap-moi.jpg','./accueil-banniere.jpg'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(CORE);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('vap-et-moi-ultima-cache-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  const isAppPage=event.request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname==='/vap-et-moi-fidelite/';
  if(isAppPage){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{const response=await fetch(event.request,{cache:'no-store'});if(response&&response.ok)await cache.put(event.request,response.clone());return response;}
      catch(error){return (await cache.match(event.request))||(await cache.match('./index.html'))||Response.error();}
    })());
    return;
  }
  event.respondWith((async()=>{const cached=await caches.match(event.request);if(cached)return cached;try{const response=await fetch(event.request);if(response&&response.ok){const cache=await caches.open(CACHE);cache.put(event.request,response.clone());}return response;}catch(error){return cached||Response.error();}})());
});
