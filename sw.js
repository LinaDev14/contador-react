const CACHE_ELEMENTS = [
    "./",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "./style.css",
    "./components/Contador.js"
]

const CACHE_NAME = "v1_cache_contador_react";

//const self = this

self.addEventListener('install', (e) => {
    //console.log(e);

    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            //addAll, permite agregar todos los elementosc a la cache
            cache.addAll(CACHE_ELEMENTS).then(() => {
                self.skipWaiting()
            }).catch(error => {})
        })
    )
})


self.addEventListener('activate', (e) => {
    //console.log(e);

    const cacheWhiteList = [CACHE_NAME];

    e.waitUntil(
        //el metodo keys me da todas las claves por si tenemos más de ua lista de caché
        caches.keys().then(cacheNames => {
            //console.log(cacheNames);

            return Promise.all(cacheNames.map(cacheName => {
                return (
                    cacheWhiteList.indexOf(cacheName) === -1 && caches.delete(cacheName)
                );
            }));
        }).then(() => self.clients.claim())
    );
});


self.addEventListener('fetch', (e) => {

    e.respondWith(
        caches.match(e.request).then((res) => {
            if (res) {
                return res
            }

            return fetch(e.request)
        })
    )
});