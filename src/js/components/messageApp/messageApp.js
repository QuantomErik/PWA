import WebSocketService from '../websocketService/webSocket.js'
/* import { chatState } from '../chatState/chatState.js' */



const template = document.createElement('template')
template.innerHTML = `
  <style>
    /* Add your CSS styles here */
    #chatWindow {
        position: relative; /* Needed for absolute positioning of the exit button */
        display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    max-height: 600px;
    overflow: hidden;
    margin: 20px;
    background-color: #f9f9f9;
    z-index: 1
    }
    #messageContainer {
        flex-grow: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    }

     /* Styles for individual messages */
  .message {
    background-color: #e7f5ff;
    padding: 5px 10px;
    margin: 5px 0;
    border-radius: 4px;
    max-width: 70%;
    word-wrap: break-word;
  }
    #messageInput {
        border: none;
    padding: 10px;
    resize: none;
    border-top: 1px solid #eee;
    }
    #sendMessageButton {
        background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    }

    #sendMessageButton:hover {
    background-color: #45a049;
  }

  #exitButton {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 20px;
      color: #333;
    }

    #dragHandle {
    background-color: #f0f0f0;
    padding: 5px;
    cursor: move;
    text-align: center;
  }

  </style>
  <div id="chatWindow">
  <div id="dragHandle">Drag Me</div>
  <button id="exitButton">X</button>
    <div id="messageContainer"></div>
    <textarea id="messageInput"></textarea>
    <button id="sendMessageButton">Send</button>
  </div>
`

customElements.define('message-app',

class MessageApp extends HTMLElement {
    static activeInstance = null

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.messageContainer = this.shadowRoot.getElementById('messageContainer')
        this.messageInput = this.shadowRoot.getElementById('messageInput')
        this.sendMessageButton = this.shadowRoot.getElementById('sendMessageButton')

        this.isDragging = false
        this.offsetX = 0
        this.offsetY = 0

        this.identifier = Date.now().toString()
    }

    connectedCallback() {
        this.checkAndSetUsername()
        this.initializeWebSocket()
        this.sendMessageButton.addEventListener('click', () => this.sendChatMessage())
        this.shadowRoot.getElementById('exitButton').addEventListener('click', () => this.closeMessageApp())

         // Add drag event listeners
    /* const chatWindow = this.shadowRoot.getElementById('chatWindow') */
    /* chatWindow.addEventListener('mousedown', (event) => this.handleDragStart(event)) */
    window.addEventListener('mousemove', (event) => this.handleDragMove(event))
    window.addEventListener('mouseup', () => this.handleDragEnd())

    const dragHandle = this.shadowRoot.getElementById('dragHandle')
    dragHandle.addEventListener('mousedown', (event) => this.handleDragStart(event))

    window.addEventListener('message-received', (event) => {
        this.displayMessage(event.detail);
        console.log('Answering from server..')
        console.log(event.detail)

        
    })
    this.shadowRoot.addEventListener('focus', () => this.makeActive(), true)
    this.shadowRoot.addEventListener('blur', () => this.makeInactive(), true)


    /* this.addEventListener('click', (event) => {
        // Check if the clicked element is not the exit button
        if (event.target.id !== 'exitButton') {
            this.makeActive()
        }
    }); */

    
   /*  this.messageInput.addEventListener('focus', () => this.makeActive())
    this.messageInput.addEventListener('blur', () => this.makeInactive()) */

    

    }

    disconnectedCallback() {
        // Remove event listeners to prevent memory leaks
    this.sendMessageButton.removeEventListener('click', this.sendChatMessage)
    // If you have a WebSocket connection, close it here
    if (this.wsService) {
        this.wsService.close()
    }
    this.shadowRoot.getElementById('exitButton').removeEventListener('click', this.closeMessageApp)
    /* this.shadowRoot.getElementById('exitButton').removeEventListener('click', this.sendChatMessage) */

    window.removeEventListener('mousemove', this.handleDragMove)
    window.removeEventListener('mouseup', this.handleDragEnd)

    }
    

    closeMessageApp() {
        this.remove() // Removes the element from the DOM
    }

    handleDragMove(event) {
        if (!this.isDragging) return;
    
        // Calculate new position
        let newX = event.clientX - this.offsetX
        let newY = event.clientY - this.offsetY
    
        // Get window dimensions
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
    
        // Get dimensions of the element
        const elementWidth = this.offsetWidth
        const elementHeight = this.offsetHeight
    
        // Boundary checks
        newX = Math.min(windowWidth - elementWidth, Math.max(0, newX))
        newY = Math.min(windowHeight - elementHeight, Math.max(0, newY))
    
        // Set new position
        this.style.position = 'absolute'
        this.style.left = `${newX}px`
        this.style.top = `${newY}px`
    }
    

    handleDragStart(event) {
        this.isDragging = true
        this.offsetX = event.clientX - this.getBoundingClientRect().left
        this.offsetY = event.clientY - this.getBoundingClientRect().top

        // Set width and height explicitly
    this.style.width = `${this.offsetWidth}px`
    this.style.height = `${this.offsetHeight}px`
        event.preventDefault()
    }

    handleDragMove(event) {
        if (!this.isDragging) return
        this.style.position = 'absolute'
        this.style.left = `${event.clientX - this.offsetX}px`
        this.style.top = `${event.clientY - this.offsetY}px`
    }

    handleDragEnd() {
        this.isDragging = false;
    }

    checkAndSetUsername() {
        let username = localStorage.getItem('username')
        if (!username) {
            username = prompt('Please enter your username:')
            if (username) {
                localStorage.setItem('username', username)
            }
        }
        this.username = username;
    }

    initializeWebSocket() {
        this.wsService = new WebSocketService('wss://courselab.lnu.se/message-app/socket')
        /* this.wsService = WebSocketService.getInstance('wss://courselab.lnu.se/message-app/socket') */ //SIngleton

        /* this.wsService.onMessageReceived = (message) => this.displayMessage(message) */
        this.wsService.connect('eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd') // Pass your API key here

        /* this.wsService.addMessageListener((message) => this.displayMessage(message)) */
        
    }

    sendChatMessage() {
        /* console.log('Active instance:', MessageApp.activeInstance, 'Current instance:', this) */
        console.log('Attempting to send message. Active instance:', MessageApp.activeInstance, 'Current instance:', this)

        if (MessageApp.activeInstance !== this) {
            console.log('Not the active instance. Message not sent.')
            // This instance is not the active one, do not send the message
            return;
        }

        const messageText = this.messageInput.value.trim()
        if (messageText) {
            this.wsService.sendMessage(messageText, this.username, 'myChannel')
            this.messageInput.value = ''
            console.log('SendChatMessage')
           
            };


           
        }
    

    displayMessage(message) {
        if (message.type === 'message')
        /* if (message.senderId !== this.identifier) */ {
            const messageElement = document.createElement('div')
            messageElement.classList.add('message')
            messageElement.textContent = `${message.username}: ${message.data}`
            this.messageContainer.appendChild(messageElement)
            console.log('Sending message')

    
            // Auto-scroll to the bottom
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight
        }
    }

    makeActive() {
        MessageApp.activeInstance = this
        console.log('Active instance set', this)
        this.style.zIndex = 100
    }

    /* makeInactive() {
        if (MessageApp.activeInstance === this) {
            MessageApp.activeInstance = null
            console.log('Active instance unset', this)
        }
    } */
    makeInactive() {
        // This timeout ensures that we check the active element after the blur event completes
        setTimeout(() => {
            if (!this.shadowRoot.activeElement) {
                MessageApp.activeInstance = null
                console.log('Active instance unset', this)
                this.style.zIndex = 1
            }
        });
    }



}


)



























/* const wsService = new WebSocketService('wss://courselab.lnu.se/message-app/socket')
const apiKey = 'your-api-key' 
wsService.connect(apiKey)


wsService.sendMessage('Hello!', 'MyUsername', 'myChannel') */

// Add logic to handle incoming messages
// For example, you could subscribe to certain events emitted by the WebSocketService



























/* const socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')

socket.onopen = function(event) {
    console.log('Connected to the WebSocket server')
    // You might want to enable the message input here
}

socket.onmessage = function(event) {
    const message = JSON.parse(event.data)
    if (message.type === 'message') {
        // Handle the incoming message
    } else if (message.type === 'heartbeat') {
        // Handle heartbeat messages
    }
}

socket.onerror = function(event) {
    console.error('WebSocket error:', event)
}

socket.onclose = function(event) {
    console.log('WebSocket connection closed')
    // You might want to disable the message input here
}

function sendMessage(messageText) {
    const username = localStorage.getItem('username') // Assuming you've stored the username in localStorage
    const apiKey = 'your-api-key' // Replace with your actual API key

    const message = {
        type: 'message',
        data: messageText,
        username: username,
        channel: 'my, not so secret, channel', // You can make this dynamic if needed
        key: apiKey
    }

    socket.send(JSON.stringify(message))
} */

