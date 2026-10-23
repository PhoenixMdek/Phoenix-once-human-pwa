// Publicación e9a5ae029c776543c54243fb8f622c482477b5a3
const VERSION='phoenix-shell-v0.12.0';
const ROOT=new URL('./',self.registration.scope);
const APP_FILES=['index.html','style.css','manifest.webmanifest','icon-192.svg','icon-512.svg','catalog.js','media.js','media-view.js','mods-es.js','deviations-es.js','names-es.js','mod-options.js','builds.js','core.js','collection.js','world.js','supply.js','wiki.js','catalog-cleanup.js','storage.js','app.js','pwa.js'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(VERSION);
  await cache.addAll(APP_FILES.map(file=>new URL(file,ROOT).href));
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const key of await caches.keys())if(key.startsWith('phoenix-shell-')&&key!==VERSION)await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('message',event=>{if(event.data==='PHOENIX_ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  const request=event.request;if(request.method!=='GET')return;
  const url=new URL(request.url);if(url.origin!==self.location.origin||url.pathname.endsWith('/api/state')||url.pathname.endsWith('/phoenix-health'))return;
  event.respondWith((async()=>{
    const cache=await caches.open(VERSION);
    try{
      const response=await fetch(request);
      if(response.ok&&response.type==='basic')await cache.put(request,response.clone());
      return response;
    }catch(error){const cached=await cache.match(request);if(cached)return cached;throw error;}
  })());
});
