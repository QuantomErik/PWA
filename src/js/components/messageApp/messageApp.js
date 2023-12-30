import WebSocketService from '../websocketService/webSocket.js'
import CryptoJS from 'crypto-js'
const IMG_URL = (new URL('images/open-data.png', import.meta.url)).href
const IMG_URL2 = (new URL('images/encrypted-data.png', import.meta.url)).href

/* import { chatState } from '../chatState/chatState.js' */

const template = document.createElement('template')
template.innerHTML = `
  <style>
    /* Add your CSS styles here */
    #chatWindow {
        position: relative; /* Needed for absolute positioning of the exit button */
        display: flex;
    flex-direction: column;
    /* border: 1px solid #ddd; */
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: none;
    max-height: none;
    width: 380px;
    height: 440px;
    overflow: hidden;
    /* margin: 20px; */
    background-color: #f9f9f9;
    z-index: 1;
    resize: both;
  
  /* border: 1px solid black; */
    }
    #messageContainer {
        flex-grow: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #fff;
    /* border-bottom: 1px solid #eee; */
    height: 300px;
    /* background-color: #b0bbe7; */
    background: linear-gradient(to right, #b0bbe7 0%, #1f2e5c 100%);
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
        flex-grow: 1;
        border: none;
    padding: 10px;
    background: linear-gradient(to right, #5a5b5b 0%, #2a2b2b 100%);
    color: #23b82a;
    font-weight: bold;
    resize: none;
    }

    #messageInput:focus {
    outline: none;
}

    #sendMessageButton {
        background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    /* height: 40px; */
    }

    #sendMessageButton:hover {
    background-color: #45a049;
  }

  #exitButton {
      position: absolute;
      right: 1px;
      /* margin-top: 1px;
      margin-bottom: 10px; */
      cursor: pointer;
      border: none;
      background: none;
      font-size: 30px;
      color: white;


      
    }

    #dragHandle {
    /* margin-bottom: 5px; */
    background-color: orange;
    /* background: linear-gradient(to right, #ffcc80 0%, #ff8c00 20%); */
    color: transparent;
    width: 100%;
    height: 30px;
    align-items: center; 
    display: flex; 
    /* justify-content: center; */
    justify-content: space-between;
    
  }

  #chatInputContainer {
    display: flex;
       /*  padding: 10px; */
        /* border-top: 1px solid #eee; */
        /* background-color: #f9f9f9; */
        height: 40px;
        background: #2a2b2b;
    }

    /* #resizer {
        width: 20px;
        height: 20px;
        background-color: grey;
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: nwse-resize;
    } */

    .message-sent {
    background-color: #95f08d; 
    text-align: right;
    float: left; 
}

.message-received {
    background-color: #89d6f5; 
    text-align: left;
    float: right; 
}

.clearfix::after {
    content: "";
    clear: both;
    display: table;
}

#encryptionToggle {
    /* position: absolute; */
    /* top: 0; */
    left: 1px;
    font-size: 30px;
    display: none
    /* justify-content: left; */
   /*  text-align: left; */
   /*  align-items: left;  */
}

#encryptionToggleLabel {
    display: inline-block;
    width: 40px;
    height: 40px;
    /* background-image: url('js/components/messageApp/images/open-data.png'); */
    background: url("${IMG_URL}") no-repeat center/50%;
   /*  element.style.backgroundImage = "url('./images/open-data.png')"; */
    cursor: pointer;
    /* Add any additional styling such as margin, alignment, etc. */
}

#encryptionToggle:checked + #encryptionToggleLabel {
    display: inline-block;
    /* background-image: url('js/components/messageApp/images/encrypted-data.png'); */
    background: url("${IMG_URL2}") no-repeat center/50%;
    width: 40px;
    height: 40px;
}

   /*  #dragHandle {
    background-color: #f0f0f0;
    padding: 5px;
    cursor: move;
    
  } */

  </style>
  <div id="chatWindow">

  

  <div id="dragHandle">
  <input type="checkbox" id="encryptionToggle">
  <label for="encryptionToggle" id="encryptionToggleLabel"></label>
  <button id="exitButton">&times;</button>
  <!-- <div id="resizer"></div> -->
  </div>
  
    <div id="messageContainer"></div>

    <div id="chatInputContainer">

    <!-- <label for="encryptionToggle">Encrypt Messages:</label>
    <input type="checkbox" id="encryptionToggle"> -->
    

    
    <textarea id="messageInput" placeholder="Type your message..."></textarea>
    <button id="sendMessageButton">Send</button>
  </div>
  </div>
`

customElements.define('message-app',

  /**
   *
   */
  class MessageApp extends HTMLElement {
    encryptionEnabled = false

    /* static activeInstance = null */

    /**
     *
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.messageContainer = this.shadowRoot.getElementById('messageContainer')
      this.messageInput = this.shadowRoot.getElementById('messageInput')
      this.sendMessageButton = this.shadowRoot.getElementById('sendMessageButton')

      this.isDragging = false
      this.offsetX = 0
      this.offsetY = 0

      this.userId = 'user-' + Date.now() + '-' + Math.floor(Math.random() * 1000)

      this.secretKey = 'ey222ci'

      /*  this.identifier = Date.now().toString() */
    }

    /**
     *
     */
    connectedCallback () {
      this.checkAndSetUsername()
      this.initializeWebSocket()
      this.sendMessageButton.addEventListener('click', () => {
        this.sendChatMessage()
    })


      this.messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          this.sendChatMessage()
        }
      })
      this.shadowRoot.getElementById('exitButton').addEventListener('click', () => this.closeMessageApp())

      // Add drag event listeners
      /* const chatWindow = this.shadowRoot.getElementById('chatWindow') */
      /* chatWindow.addEventListener('mousedown', (event) => this.handleDragStart(event)) */
      window.addEventListener('mousemove', (event) => this.handleDragMove(event))
      window.addEventListener('mouseup', () => this.handleDragEnd())

      const dragHandle = this.shadowRoot.getElementById('dragHandle')
      dragHandle.addEventListener('mousedown', (event) => this.handleDragStart(event))

      window.addEventListener('message-received', (event) => {
        this.displayMessage(event.detail)
        console.log('Answering from server..')
        console.log(event.detail)
      })
      /* this.shadowRoot.addEventListener('focus', () => this.makeActive(), true)
    this.shadowRoot.addEventListener('blur', () => this.makeInactive(), true) */

      const lastMessages = this.wsService.getMessagesHistory()
      lastMessages.forEach(message => this.displayMessage(message))

      const encryptionToggle = this.shadowRoot.getElementById('encryptionToggle')

      encryptionToggle.addEventListener('change', () => {
        this.encryptionEnabled = encryptionToggle.checked
        console.log('Going dark..')
      })

      /* const encryptionToggleLabel = this.shadowRoot.getElementById('encryptionToggleLabel');
    if (encryptionToggleLabel) {
        encryptionToggleLabel.style.backgroundImage = "url('js/components/messageApp/images/open-data.png')";
    } */

      /* const encryptionToggle = this.shadowRoot.getElementById('encryptionToggle');
    encryptionToggle.addEventListener('change', () => {
        this.encryptionEnabled = encryptionToggle.checked;
    }) */

      /* this.resizer = this.shadowRoot.getElementById('resizer')
        this.resizer.addEventListener('click', (event) => this.quarter(event)) */

      /* if (clicked) {
        window.focus();
      } */

      /* this.addEventListener('click', (event) => {
        // Check if the clicked element is not the exit button
        if (event.target.id !== 'exitButton') {
            this.makeActive()
        }
    }); */

      /*  this.messageInput.addEventListener('focus', () => this.makeActive())
    this.messageInput.addEventListener('blur', () => this.makeInactive()) */

      /* this.wsService = WebSocketService.getInstance('wss://your-websocket-url');
    this.wsService.subscribe(this); */
    }

    /* quarter() {

        const screenAvailWidth = window.screen.availWidth
        console.log(screenAvailWidth)
        window.outerHeight = window.screen.availHeight
        window.resizeTo(window.screen.availWidth / 2, window.screen.availHeight / 2);
      } */

    /**
     *
     */
    disconnectedCallback () {
      // Remove event listeners to prevent memory leaks
      this.sendMessageButton.removeEventListener('click', this.sendChatMessage)
      // If you have a WebSocket connection, close it here
      /* if (this.wsService) {
        this.wsService.close()
    } */
      this.shadowRoot.getElementById('exitButton').removeEventListener('click', this.closeMessageApp)
      /* this.shadowRoot.getElementById('exitButton').removeEventListener('click', this.sendChatMessage) */

      window.removeEventListener('mousemove', this.handleDragMove)
      window.removeEventListener('mouseup', this.handleDragEnd)

      /* this.wsService.unsubscribe(this) */
    }

    /**
     *
     */
    closeMessageApp () {
      this.remove() // Removes the element from the DOM
    }

    /* handleDragMove(event) {
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
    } */

    /**
     *
     * @param event
     */
    handleDragStart (event) {
      this.isDragging = true
      this.offsetX = event.clientX - this.getBoundingClientRect().left
      this.offsetY = event.clientY - this.getBoundingClientRect().top

      // Set width and height explicitly
      this.style.width = `${this.offsetWidth}px`
      this.style.height = `${this.offsetHeight}px`
      event.preventDefault()
    }

    /**
     *
     * @param event
     */
    handleDragMove (event) {
      if (!this.isDragging) return
      this.style.position = 'absolute'
      this.style.left = `${event.clientX - this.offsetX}px`
      this.style.top = `${event.clientY - this.offsetY}px`
    }

    /**
     *
     */
    handleDragEnd () {
      this.isDragging = false
    }

    /**
     *
     */
    checkAndSetUsername () {
      let username = localStorage.getItem('username')
      if (!username) {
        username = prompt('Please enter your username:')
        if (username) {
          localStorage.setItem('username', username)
        }
      }
      this.username = username
    }

    /**
     *
     */
    initializeWebSocket () {
      /* this.wsService = new WebSocketService('wss://courselab.lnu.se/message-app/socket') */
      this.wsService = WebSocketService.getInstance('wss://courselab.lnu.se/message-app/socket') // SIngleton

      /* this.wsService.onMessageReceived = (message) => this.displayMessage(message) */
      /*  this.wsService.connect('eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd') */ // Pass your API key here

      /* this.wsService.addMessageListener((message) => this.displayMessage(message)) */
    }

    /**
     *
     */
    sendChatMessage () {
      const messageText = this.messageInput.value.trim()
      if (messageText) {
        if (this.encryptionEnabled) {
          /* finalMessage = this.encryptMessage(messageText) */

          const encryptedMessage = this.encryptMessage(messageText)
          this.wsService.sendMessage(encryptedMessage, this.username, 'myChannel', this.userId)
        } else {
          this.wsService.sendMessage(messageText, this.username, 'myChannel', this.userId)
        }

        /* this.wsService.sendMessage(messageText, this.username, 'myChannel', this.userId) */
        console.log(messageText)
        console.log(this.encryptMessage)

        this.messageInput.value = ''
        console.log('SendChatMessage')

        /* this.wsService.broadcastMessage(messageText, this.username, 'myChannel') */
      }
    }

    /**
     *
     * @param message
     */
    displayMessage (message) {
      if (message.type === 'message')
      /* if (message.senderId !== this.identifier) */ {
        /* const decryptedMessage = this.decryptMessage(message.data) */

        const messageElement = document.createElement('div')
        messageElement.classList.add('message')

        if (message.senderId === this.userId) {
          messageElement.classList.add('message-sent')
        } else {
          messageElement.classList.add('message-received')
        }

        if (this.encryptionEnabled) {
          const decryptedMessage = this.decryptMessage(message.data)
          messageElement.textContent = `${message.username}: ${decryptedMessage}`
        } else {
          messageElement.textContent = `${message.username}: ${message.data}`
        }

        /*  messageElement.textContent = `${message.username}: ${message.data}` */
        /* messageElement.textContent = `${message.username}: ${decryptedMessage}` */
        /* messageElement.textContent = `${message.username}: ${displayText}` */
        this.messageContainer.appendChild(messageElement)
        console.log('Sending message')

        // Add clearfix
        const clearfix = document.createElement('div')
        clearfix.classList.add('clearfix')
        this.messageContainer.appendChild(clearfix)

        // Auto-scroll to the bottom
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight
      }
    }

    /**
     *
     * @param message
     */
    isMessageSentByUser (message) {
      return message.username === this.username
    }

    /**
     *
     * @param message
     */
    encryptMessage (message) {
      return CryptoJS.AES.encrypt(message, this.secretKey).toString()
    }

    /**
     *
     * @param ciphertext
     */
    decryptMessage (ciphertext) {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey)
      return bytes.toString(CryptoJS.enc.Utf8)
    }

    /*  makeActive() {
        MessageApp.activeInstance = this
        console.log('Active instance set', this)
        this.style.zIndex = 100
    } */

    /*  makeInactive() {
            if (!this.shadowRoot.activeElement) {
                MessageApp.activeInstance = null
                console.log('Active instance unset', this)
                this.style.zIndex = 1
            }

    } */
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
