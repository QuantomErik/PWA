import './components/dock/index.js'

/**
 * The main script file of the application.
 *
 * @author // TODO: YOUR NAME <YOUR EMAIL>
 * @version 1.0.0
 */

console.log('TODO: Start working on the assignment')

let zIndexCounter = 100
const offset = 20
/**
 *
 */
function createDock () {
  const dockElement = document.createElement('app-dock')
  document.body.append(dockElement)

  dockElement.addEventListener('start-message-app', () => {
    console.log('Starting message app...')
    createWindow('message-app')
  })

  dockElement.addEventListener('start-memory-game', () => {
    console.log('Starting memoryGame...')
    createWindow('memory-game')
  })

  dockElement.addEventListener('start-custom-app', () => {
    console.log('Starting customApp...')
    createWindow('custom-app')
  })
}

/**
 *
 * @param appType
 */
function createWindow (appType) {
  zIndexCounter++
  const appElement = document.createElement(appType)
  appElement.style.position = 'absolute'
  appElement.style.zIndex = zIndexCounter
  appElement.style.left = `${offset * (zIndexCounter - 100)}px`
  appElement.style.top = `${offset * (zIndexCounter - 100)}px`

  appElement.addEventListener('click', () => bringToFront(appElement))

  document.body.append(appElement)
}

/**
 *
 * @param element
 */
function bringToFront (element) {
  zIndexCounter++
  element.style.zIndex = zIndexCounter
}

createDock()

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/serviceworker.js')

      console.log('ServiceWorker: Registration successful with scope: ', registration.scope)
    } catch (error) {
      console.log('ServiceWorker: Registration failed: ', error)
    }
  })
}
