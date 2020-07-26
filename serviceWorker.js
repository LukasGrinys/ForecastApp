self.addEventListener('install', async event => {
    // console.log('install event')
});
  
self.addEventListener('fetch', async event => {
    const req = event.request;
    if (!req.url.includes('api.openweathermap')) {
        event.respondWith(cacheFirst(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || networkFirst(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try { 
      const fresh = await fetch(req);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (e) { 
      const cachedResponse = await cache.match(req);
      return cachedResponse;
    }
}

const cacheName = 'luko-forecast-app';
const staticAssets = [
  './',
  './index.html',
  './favicon.png',
  './favicon.ico',
  './public/styles.css',
  './public/header.png',
  './public/icons/01d.png',
  './public/icons/01n.png',
  './public/icons/02d.png',
  './public/icons/02n.png',
  './public/icons/03d.png',
  './public/icons/03n.png',
  './public/icons/04d.png',
  './public/icons/04n.png',
  './public/icons/09d.png',
  './public/icons/09n.png',
  './public/icons/10d.png',
  './public/icons/10n.png',
  './public/icons/11d.png',
  './public/icons/11n.png',
  './public/icons/13d.png',
  './public/icons/13n.png',
  './public/icons/50d.png',
  './public/icons/50n.png',
  './public/app_icons/icon-72x72.png',
  './public/app_icons/icon-96x96.png',
  './public/app_icons/icon-128x128.png',
  './public/app_icons/icon-144x144.png',
  './public/app_icons/icon-152x152.png',
  './public/app_icons/icon-192x192.png',
  './public/app_icons/icon-384x384.png',
  './public/app_icons/icon-512x512.png',
  './app.js',
  './config.js',
  './currentCitylistReduced.json',
  './lib/Helpers.js',
  './factories/cityData.js',
  './factories/storageHandler.js',
  './factories/weatherService.js',
  './components/bottom-box.component.html',
  './components/input-box.component.html',
  './components/loading-widget.component.html',
  './components/main-box.component.html',
  './components/units-container.component.html',
  './components/bottom-box.component.js',
  './components/input-box.component.js',
  './components/loading-widget.component.js',
  './components/main-box.component.js',
  './components/units-container.component.js'
];