const version = '1.0.0'


if ('serviceWorker' in navigator) {
    window.addEventListener('load', async function () {
        try {
            const registration = await this.navigator.serviceWorker.register('/service-worker.js')

            console.log('ServiceWorker: Registration successful with scope: ', registration.scope)
        } catch (error) {
            console.log('ServiceWorker: Registration failed: ', error)
        }
    })
}

self.addEventListener('install', event => {
    console.log('ServiceWorker: Installed version ', version)

    const cacheAssets = async () => {
        const cache = await self.caches.open(version)

        console.log('ServiceWorker: Caching Files')

        return cache.addAll([
            'index.html',
            'css/styles.css'
        ])
    }
    event.waitUntil(cacheAssets())

    /* const cachedFetch = async request => {
        try {

            const response = await fetch(request)

            const cache = await caches.open(version)
            cache.put(request, response.clone())

            return response
        } catch (error) {
            console.info('ServiceWorker: Serving cached result')
            return caches.match(request)
        }
    } */

    
})





self.addEventListener('activate', event => {
    console.log('ServiceWorker: Installed version ', version)
})



self.addEventListener('fetch', event => {
    console.log('ServiceWorker: Fetching')

    const cachedFetch = async request => {
        try {

            const response = await fetch(request)

            const cache = await self.caches.open(version)
            cache.put(request, response.clone())

            return response
        } catch (error) {
            console.info('ServiceWorker: Serving cached result')
            return self.caches.match(request)
        }
    }

    event.respondWith(cachedFetch(event.request))
})



self.addEventListener('message', event => {
    console.log('ServiceWorker: Got a message')
})



self.addEventListener('push', event => {
    console.log('ServiceWorker: Got a push message from the server')  // Kan kolla på notification Api för push notiser
})