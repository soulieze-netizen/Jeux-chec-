const C='echecs-v6';const F=['./','index.html','manifest.json','icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
// réseau d'abord (mises à jour), cache si hors ligne ou réseau trop lent (3 s)
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 const net=fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}return r;});
 const slow=new Promise(res=>setTimeout(res,3000)).then(()=>caches.match(e.request,{ignoreSearch:true}));
 e.respondWith(Promise.race([net.catch(()=>slow.then(x=>x)),slow.then(x=>x||net)]).then(r=>r||caches.match('index.html')).catch(()=>caches.match('index.html')));});
