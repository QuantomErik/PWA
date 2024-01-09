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
      'js/index.js',
      'js/components/customApp/images/magnifying-glass.png',
      'js/components/customApp/images/position.png',
      'js/components/customApp/images/error.png',
      'js/components/customApp/images/snowing.png',
      'js/components/customApp/images/cloud.png',
      'js/components/customApp/images/cloudy-day.png',
      'js/components/customApp/images/droplet.png',
      'js/components/customApp/images/humidity.png',
      'js/components/customApp/images/rain-drops.png',
      'js/components/customApp/images/raining.png',
      'js/components/customApp/images/snowflake.png',
      'js/components/customApp/images/snowing.png',
      'js/components/customApp/images/sun.png',
      'js/components/customApp/images/wind.png',
      'js/components/memoryGame/images/0.png',
      'js/components/memoryGame/images/1.png',
      'js/components/memoryGame/images/2.png',
      'js/components/memoryGame/images/3.png',
      'js/components/memoryGame/images/4.png',
      'js/components/memoryGame/images/5.png',
      'js/components/memoryGame/images/6.png',
      'js/components/memoryGame/images/7.png',
      'js/components/memoryGame/images/8.png',
      'js/components/messageApp/images/cyberpunk.png',
      'js/components/messageApp/images/encrypted-data.png',
      'js/components/messageApp/images/open-data.png',
      'js/components/messageApp/images/safe.png'
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
