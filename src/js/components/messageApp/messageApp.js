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
    height: 417px;
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
    
        text-align: center;
    /* display: none; */
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
        /* display: none; */
       
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





.modal {
  display: none;
  position: absolute; 
  z-index: 2;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); 
  width: 80%;  
  max-width: 300px; 
  
}

.modal-content {
  /* background-color: #fefefe; */
  padding: 20px;
  /* border: 1px solid #888 */
}



/* .close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
} */

   /*  #dragHandle {
    background-color: #f0f0f0;
    padding: 5px;
    cursor: move;
    
  } */

  </style>

<!-- <div id="nicknameSection" style="display: none;">
    <form id="nicknameForm">
      <input type="text" id="nicknameInput" placeholder="Enter your nickname" required>
      <button type="submit" id="nicknameSubmit">Enter Chat</button>
    </form>
  </div> -->

  <div id="chatWindow">

  <!-- <div id="usernamePrompt" class="modal">
  <div class="modal-content">
    
    <p>Please enter your username:</p>
    <input type="text" id="usernameInput">
    <button id="usernameSubmit">Submit</button>
  </div>
</div> -->

  

  <div id="dragHandle">
  <input type="checkbox" id="encryptionToggle">
  <label for="encryptionToggle" id="encryptionToggleLabel"></label>
  <button id="exitButton">&times;</button>
  <!-- <div id="resizer"></div> -->
  </div>
  
    <div id="messageContainer">

    <div id="usernameModal" class="modal">
  <div class="modal-content">
  <form id="usernameForm">
    <p>Please enter your username:</p>
    <input type="text" id="usernameInput">
    <button id="usernameSubmit">Submit</button>
    </form>
  </div>


</div>


    </div>

    

    
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
      this.chatInputContainer = this.shadowRoot.getElementById('chatInputContainer')
      this.messageInput = this.shadowRoot.getElementById('messageInput')
      this.sendMessageButton = this.shadowRoot.getElementById('sendMessageButton')
      /* this.nicknameSection = this.shadowRoot.getElementById('nicknameSection') */
      this.chatWindow = this.shadowRoot.getElementById('chatWindow')
      this.usernameModal = this.shadowRoot.getElementById('usernameModal')
      this.submitButton = this.shadowRoot.getElementById('usernameSubmit')
      this.input = this.shadowRoot.getElementById('usernameInput')
      this.usernameForm = this.shadowRoot.getElementById('usernameForm')
      /* this.nicknameInput = this.shadowRoot.getElementById('nicknameInput') */

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

    }

    
    showUsernamePrompt() {
      this.usernameModal.style.display = 'block'

      this.usernameForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const username = this.input.value.trim()
        if (username) {
          localStorage.setItem('username', username)
          this.username = username
          this.usernameModal.style.display = 'none'
          this.showChatInputContainer()
        }
      
      })
    
     
     
        
      
    }
    

    /**
     *
     */
    disconnectedCallback () {
      // Remove event listeners to prevent memory leaks
      this.sendMessageButton.removeEventListener('click', this.sendChatMessage)
      
      /* if (this.wsService) {
        this.wsService.close()
    } */
      this.shadowRoot.getElementById('exitButton').removeEventListener('click', this.closeMessageApp)
      /* this.shadowRoot.getElementById('exitButton').removeEventListener('click', this.sendChatMessage) */

      window.removeEventListener('mousemove', this.handleDragMove)
      window.removeEventListener('mouseup', this.handleDragEnd)

      
    }

    /**
     *
     */
    closeMessageApp () {
      this.remove() // Removes the element from the DOM
    }

  

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



    checkAndSetUsername() {
      let username = localStorage.getItem('username')
      if (!username) {
        this.showUsernamePrompt()
        this.hideChatInputContainer()
      } else {
        this.username = username
        this.showChatInputContainer()
      }
    }
    /**
     *
     */
    /* checkAndSetUsername () {
      let username = localStorage.getItem('username')
      if (!username) {
        username = prompt('Please enter your username:')
        if (username) {
          localStorage.setItem('username', username)
        }
      }
      this.username = username
    } */

    hideChatInputContainer() {
      
      if (this.chatInputContainer) {
        this.chatInputContainer.style.display = 'none'
      }
    }

    showChatInputContainer() {
      
      if (this.chatInputContainer) {
        this.chatInputContainer.style.display = 'flex'
      }
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

    
  }

)

