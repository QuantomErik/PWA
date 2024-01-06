const version = '1.0.0'

self.addEventListener('install', event => {
  console.log('ServiceWorker: Installed version ', version)

  /**
   * Caches essential assets during the install phase of the Service Worker.
   * This function is asynchronous and will wait until the cache is opened and assets are added.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when caching is complete.
   */
  const cacheAssets = async () => {
    const cache = await self.caches.open(version)

    console.log('ServiceWorker: Caching Files')

    return cache.addAll([
      'index.html',
      'css/styles.css',
      'js/index.js'

    ])
  }
  event.waitUntil(cacheAssets())
})

self.addEventListener('activate', event => {
  console.log('ServiceWorker: Installed version ', version)

  /**
   * Removes old caches that do not match the current version.
   * This function is asynchronous and will wait until all non-matching caches are deleted.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when old caches are cleared.
   */
  const removeCachedAssets = async () => {
    const cacheKeys = await caches.keys()

    return Promise.all(
      cacheKeys.map(cache => {
        if (cache !== version) {
          console.info('ServiceWorker: Clearing Cache', cache)
          return caches.delete(cache)
        }

        return undefined
      })
    )
  }

  event.waitUntil(removeCachedAssets())
})

self.addEventListener('fetch', event => {
  console.log('ServiceWorker: Fetching')

  /**
   * Attempts to fetch the request from the network and falls back to the cache if the network fails.
   * This function is asynchronous and returns the network response or cached response.
   *
   * @async
   * @param {Request} request - The request object to fetch.
   * @returns {Promise<Response>} A promise that resolves to the response of the request.
   */
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
  console.log('ServiceWorker: Got a push message from the server')

  const title = 'New Push Notification'
  const options = {
    body: 'You have received a new message.',
    icon: 'images/egg.png',
    badge: 'images/egg.png'
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})
