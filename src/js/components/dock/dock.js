import '../messageApp/index.js'

const template = document.createElement('template')

/* const imageUrl = './images/aurora.jpg' */

/* background-image: url('${imageUrl}');  */

template.innerHTML = `
<style>
  #app-dock {
    display: flex;
    flex-direction: column; 
    justify-content: start;
    align-items: center;
    position: fixed;
    right: 0; /* Position to the right */
    top: 50%; /* Center vertically */
    transform: translateY(-50%); /* Adjust for exact centering */
    /* bottom: 0; */
    /* width: 100%; */
    /* background-color: #333; */
    padding: 10px 0;
  }
  .app-icon {
    margin: 0 10px;
    margin-bottom: 10px;
    cursor: pointer;
    width: 50px;
    height: 50px;
    border-radius: 10px;
  }
</style>
<div id="app-dock">
  <img id="memoryGameIcon" src="js/components/dock/images/memory-game.png" class="app-icon">
  <img id="messagesAppIcon" src="js/components/dock/images/chat-box.png" class="app-icon">
  <img id="customAppIcon" src="js/components/dock/images/custom.png" class="app-icon">
</div>
`


/* `
  <div id="app-dock" style="display: flex; justify-content: left; align-items: center; position: fixed; bottom: 0; width: 60%; background-color: #333; padding: 10px 0;">
    <button id="memoryGameIcon" style="background: none; border: none; margin: 0 10px; color: white; font-size: 16px; cursor: pointer;">Memory Game</button>
    <button id="messagesAppIcon" style="background: none; border: none; margin: 0 10px; color: white; font-size: 16px; cursor: pointer;">Message App</button>
    <button id="customAppIcon" style="background: none; border: none; margin: 0 10px; color: white; font-size: 16px; cursor: pointer;">Custom App</button>
   
  </div>
` */

window.customElements.define('app-dock',


class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true)) 
    }

    connectedCallback() {
        this.shadowRoot.getElementById('memoryGameIcon').addEventListener('click', () => this.openApp('memoryGame'))
        this.shadowRoot.getElementById('messagesAppIcon').addEventListener('click', () => this.openApp('messagesApp'))
        this.shadowRoot.getElementById('customAppIcon').addEventListener('click', () => this.openApp('customApp'))
    }

    openApp(appName) {
      console.log(`Opening ${appName}`)

      if (appName === 'messagesApp') {
       
        this.dispatchEvent(new CustomEvent('start-message-app', {
          bubbles: true,
          
        }))
          // Create a new instance of messageApp
          /* const messageApp = document.createElement('message-app'); */
          // Assign a unique identifier
          /* const instanceId = 'message-app-instance-' + new Date().getTime(); // Using timestamp for uniqueness
          messageApp.id = instanceId; */
          // Add custom styling or attributes if needed
  
          // Append the new instance to the body or a specific container
          /* document.body.appendChild(messageApp); */
  
          // Optionally, focus the newly created instance or bring it to the front
      }

      if (appName === 'memoryGame') {
       
        this.dispatchEvent(new CustomEvent('start-memory-game', {
          bubbles: true,
          
        }))


      }

      if (appName === 'customApp') {
       
        this.dispatchEvent(new CustomEvent('start-custom-app', {
          bubbles: true,
          
        }))


      }
  
      // Handle other apps similarly
    }
}



)
