
  self.addEventListener('install', async function () { 
   const cache = await caches.open('static-v1'); 
   cache.addAll(['styles.css', 'index.html']); 
 }); 
 
 
 self.addEventListener('activate', event => { 
   event.waitUntil(self.clients.claim()); 
 }); 
 
 
 addEventListener('fetch', event => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method != 'GET') return;

  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function() {
    // Try to get the response from a cache.
    const dynamicCache = await caches.open('dynamic-v3');
    
    const networkResponse = await fetch(event.request);
    if (networkResponse) {
      // If we found a match in the cache, return it, but also
      // update the entry in the cache in the background.
      //event.waitUntil(dynamicCache.add(event.request));
      dynamicCache.put(event.request, networkResponse.clone());
      return networkResponse;
    }else{
      const cachedResponse = await dynamicCache.match(event.request);
      return cacheResponse;
    }

    // If we didn't find a match in the cache, use the network and update cache.
    
    //
    
  }());
});
