import './components/dock/index.js'

/**
 * The main script file of the application. This script is responsible for creating a dock and managing the creation of different app windows (like
 * message app, memory game, and custom app) on the screen. It also handles the registration of a service worker for the application.
 *
 * @file index.js - Main script for the application.
 * @author Erik Yang <ey222ci@student.lnu.se>
 * @version 1.0.0
 */

let zIndexCounter = 100
const offset = 20

/**
 * Creates the dock element and appends it to the body of the document.
 * It also sets up event listeners for starting different apps like message app, memory game, and custom app.
 */
function createDock () {
  const dockElement = document.createElement('app-dock')
  document.body.append(dockElement)

  dockElement.addEventListener('start-message-app', () => {
    createWindow('message-app')
  })

  dockElement.addEventListener('start-memory-game', () => {
    createWindow('memory-game')
  })

  dockElement.addEventListener('start-custom-app', () => {
    createWindow('custom-app')
  })
}

/**
 * Creates a new window for the specified app type. Each window is an HTML element that represents an app, styled with absolute positioning.
 * The function ensures each new window appears above the previous ones and is staggered slightly with each new window.
 *
 * @param {string} appType - The type of app for which to create a new window.
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
 * Brings the specified element to the front by increasing its z-index.
 * This function is typically called in response to a click event on an app window.
 *
 * @param {HTMLElement} element - The DOM element to bring to the front.
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
