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

function createDock () {
const dockElement = document.createElement('app-dock')
document.body.append(dockElement)



dockElement.addEventListener('start-message-app', () => {
    console.log('Starting message app...');
    const messageElement = document.createElement('message-app')
    document.body.append(messageElement)
    // Logic to handle the event
})




dockElement.addEventListener('start-memory-game', () => {
    console.log('Starting memoryGame...');
    const memoryGame = document.createElement('memory-game')
    document.body.append(memoryGame)
    // Logic to handle the event
});


}
createDock()



