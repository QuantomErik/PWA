import './components/dock/index.js'
import './components/messageApp/index.js'
import './components/memoryGame/index.js'

/**
 * The main script file of the application.
 *
 * @author // TODO: YOUR NAME <YOUR EMAIL>
 * @version 1.0.0
 */

console.log('TODO: Start working on the assignment')

/* const dockApp = document.querySelector('#app-dock')
dockApp.addEventListener('start-message-app', () => {
    console.log('Softa')
}) */
let zIndexCounter = 100
const offset = 20
function createDock () {
const dockElement = document.createElement('app-dock')
document.body.append(dockElement)



dockElement.addEventListener('start-message-app', () => {
    console.log('Starting message app...')
    createWindow('message-app')
    /* zIndexCounter++ */
    /* const messageElement = document.createElement('message-app') */
    /* messageElement.style.position = 'absolute' */
    /* messageElement.style.zIndex = zIndexCounter */

    /* messageElement.style.left = `${offset * (zIndexCounter - 100)}px`
    messageElement.style.top = `${offset * (zIndexCounter - 100)}px` */

   /*  document.body.append(messageElement) */
    // Logic to handle the event
})




dockElement.addEventListener('start-memory-game', () => {
    /* zIndexCounter++ */
    console.log('Starting memoryGame...')
    createWindow('memory-game')
    /* const memoryGame = document.createElement('memory-game') */ // funkar
    /* memoryGame.style.zIndex = zIndexCounter */
    /* document.body.append(memoryGame)  */// Funkar
    // Logic to handle the event
})

/* dockElement.addEventListener('memory-game:game-over', () => {

console.log('gameOver')
})
 */

}

function createWindow(appType) {
    zIndexCounter++
    const appElement = document.createElement(appType);
    appElement.style.position = 'absolute'
    appElement.style.zIndex = zIndexCounter
    appElement.style.left = `${offset * (zIndexCounter - 100)}px`
    appElement.style.top = `${offset * (zIndexCounter - 100)}px`

    appElement.addEventListener('click', () => bringToFront(appElement))

    document.body.append(appElement)
}

function bringToFront(element) {
    zIndexCounter++
    element.style.zIndex = zIndexCounter
}



createDock()



