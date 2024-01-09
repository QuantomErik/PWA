/**
 * The message app web component.
 *
 * @author // Erik Yang <ey222ci@student.lnu.se>
 * @version 1.0.0
 */

import { WebSocketService } from '../websocketService/webSocket.js'
import CryptoJS from 'crypto-js'
import { config } from './config.js'
import { escapeInput, isValidInput } from '../utils/utils.js'

const IMG_URL = (new URL('images/open-data.png', import.meta.url)).href
const IMG_URL2 = (new URL('images/encrypted-data.png', import.meta.url)).href

const template = document.createElement('template')
template.innerHTML = `
  <style>

#chatWindow {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: none;
    max-height: none;
    width: 380px;
    height: 417px;
    overflow: hidden;
    background-color: #f9f9f9;
    z-index: 1;
    resize: both;
}

#messageContainer {
    flex-grow: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #fff;
    height: 300px;
    background: linear-gradient(to right, #b0bbe7 0%, #1f2e5c 100%);
    text-align: center;
}

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
}

#sendMessageButton:hover {
    background-color: #45a049;
}

#exitButton {
    position: absolute;
    right: 1px;
    cursor: pointer;
    border: none;
    background: none;
    font-size: 30px;
    color: white;
}

#dragHandle {
    background-color: orange;
    color: transparent;
    width: 100%;
    height: 30px;
    align-items: center;
    display: flex;
    justify-content: space-between;
}

#chatInputContainer {
    display: flex;
    height: 40px;
    background: #2a2b2b;
}

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
    left: 1px;
    font-size: 30px;
    display: none
}

#encryptionToggleLabel {
    display: inline-block;
    width: 40px;
    height: 40px;
    background: url("${IMG_URL}") no-repeat center/50%;
    cursor: pointer;
}

#encryptionToggle:checked+#encryptionToggleLabel {
    display: inline-block;
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
    padding: 20px;
}

#dragHandleText {
    flex-grow: 1;
    font-weight: bold;
    color: white;
    text-align: center;
    margin-right: 30px;
}

</style>
<div id="chatWindow">
   <div id="dragHandle">
      <input type="checkbox" id="encryptionToggle">
      <label for="encryptionToggle" id="encryptionToggleLabel"></label>
      <button id="exitButton">&times;</button>
      <span id="dragHandleText"></span>
   </div>
   <div id="messageContainer">
      <div id="usernameModal" class="modal">
         <div class="modal-content">
            <form id="usernameForm">
               <input type="text" id="usernameInput" placeholder="Choose your username...">
               <button id="usernameSubmit">Submit</button>
            </form>
         </div>
      </div>
   </div>
   <div id="chatInputContainer">
      <textarea id="messageInput" placeholder="Type your message..."></textarea>
      <button id="sendMessageButton">Send</button>
   </div>
</div>
`
/*
 * Define custom element.
 */
customElements.define('message-app',

  /**
   *
   */
  class extends HTMLElement {
    #controller
    #wsService
    #messageContainer
    #chatInputContainer
    #messageInput
    #sendMessageButton
    #chatWindow
    #usernameModal
    #submitButton
    #input
    #usernameForm
    #userId
    #secretKey
    #dragHandle
    #encryptionToggle
    #exitButton

    encryptionEnabled = false

    /**
     * Initializes the message app component, sets up the shadow DOM, and queries necessary DOM elements.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.#userId = 'user-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
      this.#secretKey = config.secretKey
      this.#controller = new AbortController()
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.#initializeElements()
      this.#requestNotificationPermission()
      this.#checkAndSetUsername()
      this.#initializeWebSocket()
      this.#initializeEventListeners()

      const lastMessages = this.#wsService.getMessagesHistory()
      lastMessages.forEach(message => this.#displayMessage(message))
    }

    /**
     * Lifecycle method called when the component is removed from the DOM.
     */
    disconnectedCallback () {
      this.#controller.abort()
    }

    /**
     * Initializes and assigns DOM elements to class properties.
     * This method queries the component's shadow DOM and assigns references to various elements required for the component's functionality.
     */
    #initializeElements () {
      this.#messageContainer = this.shadowRoot.querySelector('#messageContainer')
      this.#chatInputContainer = this.shadowRoot.querySelector('#chatInputContainer')
      this.#messageInput = this.shadowRoot.querySelector('#messageInput')
      this.#sendMessageButton = this.shadowRoot.querySelector('#sendMessageButton')
      this.#chatWindow = this.shadowRoot.querySelector('#chatWindow')
      this.#usernameModal = this.shadowRoot.querySelector('#usernameModal')
      this.#submitButton = this.shadowRoot.querySelector('#usernameSubmit')
      this.#input = this.shadowRoot.querySelector('#usernameInput')
      this.#usernameForm = this.shadowRoot.querySelector('#usernameForm')
      this.#dragHandle = this.shadowRoot.querySelector('#dragHandle')
      this.#encryptionToggle = this.shadowRoot.querySelector('#encryptionToggle')
      this.#exitButton = this.shadowRoot.querySelector('#exitButton')
      this.dragHandleText = this.shadowRoot.querySelector('#dragHandleText')
    }

    /**
     * Initializes all event listeners for the component.
     *
     * This method sets up various event listeners for different elements within the component.
     * It utilizes an AbortSignal from an AbortController to manage the cleanup of these listeners
     * when the component is disconnected. This helps prevent potential memory leaks.
     *
     * The listeners cover various functionalities including:
     * - Sending messages when the send button is clicked or Enter is pressed in the message input.
     * - Closing the app when the exit button is clicked.
     * - Dragging functionality for the chat window.
     * - Displaying messages when they are received through a WebSocket connection.
     * - Toggling the encryption state when the encryption toggle is changed.
     */
    #initializeEventListeners () {
      const { signal } = this.#controller

      this.#sendMessageButton.addEventListener('click', () => this.#sendChatMessage(), { signal })
      this.#exitButton.addEventListener('click', () => this.closeMessageApp(), { signal })
      window.addEventListener('mousemove', (event) => this.#handleDragMove(event), { signal })
      window.addEventListener('mouseup', () => this.#handleDragEnd(), { signal })
      this.#dragHandle.addEventListener('mousedown', (event) => this.#handleDragStart(event), { signal })
      window.addEventListener('message-received', (event) => this.#displayMessage(event.detail), { signal })

      this.#encryptionToggle.addEventListener('change', () => {
        this.encryptionEnabled = this.#encryptionToggle.checked
        console.log('Going dark..')
        if (this.encryptionEnabled) {
          this.#applyEncryptionStyles()
        } else {
          this.#revertEncryptionStyles()
        }
      }, { signal })

      this.#messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          this.#sendChatMessage()
        }
      }, { signal })
    }

    /**
     * Applies a set of styles to indicate that encryption mode is active.
     */
    #applyEncryptionStyles () {
      this.#dragHandle.style.backgroundColor = 'black'
      this.dragHandleText.style.display = 'block'
      this.dragHandleText.textContent = 'Dark mode activated'
      this.#messageContainer.style.background = 'linear-gradient(to right, #2c2c2c 0%, #000000 100%)'
    }

    /**
     * Reverts the styles applied by #applyEncryptionStyles.
     */
    #revertEncryptionStyles () {
      this.#dragHandle.style.backgroundColor = 'orange'
      this.dragHandleText.style.display = 'none'
      this.#messageContainer.style.background = 'linear-gradient(to right, #b0bbe7 0%, #1f2e5c 100%)'
    }

    /**
     * Displays a prompt to set the user's username.
     */
    #showUsernamePrompt () {
      this.#usernameModal.style.display = 'block'

      this.#usernameForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const username = this.#input.value.trim()
        if (username) {
          localStorage.setItem('username', username)
          this.username = username
          this.#usernameModal.style.display = 'none'
          this.#showChatInputContainer()
        }
      })
    }

    /**
     * Closes and removes the message app component.
     */
    closeMessageApp () {
      this.remove()
    }

    /**
     * Handles the start of a drag event.
     *
     * @param {Event} event - The event object associated with the drag start.
     */
    #handleDragStart (event) {
      this.isDragging = true
      this.offsetX = event.clientX - this.getBoundingClientRect().left
      this.offsetY = event.clientY - this.getBoundingClientRect().top

      // Set width and height explicitly
      this.style.width = `${this.offsetWidth}px`
      this.style.height = `${this.offsetHeight}px`
      event.preventDefault()
    }

    /**
     * Handles the movement during a drag event.
     *
     * @param {Event} event - The event object associated with the drag movement.
     */
    #handleDragMove (event) {
      if (!this.isDragging) return
      this.style.position = 'absolute'
      this.style.left = `${event.clientX - this.offsetX}px`
      this.style.top = `${event.clientY - this.offsetY}px`
    }

    /**
     * Handles the end of a drag event.
     */
    #handleDragEnd () {
      this.isDragging = false
    }

    /**
     * Checks and sets the username from local storage or prompts for it.
     */
    #checkAndSetUsername () {
      const username = localStorage.getItem('username')
      if (!username) {
        this.#showUsernamePrompt()
        this.#hideChatInputContainer()
      } else {
        this.username = username
        this.#showChatInputContainer()
      }
    }

    /**
     * Hides the chat input box.
     */
    #hideChatInputContainer () {
      if (this.#chatInputContainer) {
        this.#chatInputContainer.style.display = 'none'
      }
    }

    /**
     * Shows the chat input box.
     */
    #showChatInputContainer () {
      if (this.#chatInputContainer) {
        this.#chatInputContainer.style.display = 'flex'
      }
    }

    /**
     * Initializes the WebSocket connection.
     */
    #initializeWebSocket () {
      this.#wsService = WebSocketService.getInstance('wss://courselab.lnu.se/message-app/socket')
    }

    /**
     * Sends a chat message through the WebSocket. The message is first validated for length,
     * then either encrypted or escaped to prevent XSS attacks, depending on whether encryption
     * is enabled or not.
     *
     * @function sendChatMessage
     */
    #sendChatMessage () {
      const messageText = this.#messageInput.value.trim()

      if (isValidInput(messageText)) {
        // Escapes HTML special characters in the message if encryption is not enabled
      // If encryption is enabled, the original message text is used
        const finalMessage = this.encryptionEnabled ? messageText : escapeInput(messageText)
        if (this.encryptionEnabled) {
          const encryptedMessage = this.#encryptMessage(finalMessage)
          this.#wsService.sendMessage(encryptedMessage, this.username, 'myChannel', this.#userId)
        } else {
          // Sends the escaped (or original, if encrypted) message
          this.#wsService.sendMessage(finalMessage, this.username, 'myChannel', this.#userId)
        }

        this.#messageInput.value = ''
      } else {
        console.error('Invalid input or input too long')
      }
    }

    /**
     * Displays a chat message in the message container.
     *
     * @param {object} message - The message object.
     */
    #displayMessage (message) {
      if (message.type === 'message') {
        const messageElement = document.createElement('div')
        messageElement.classList.add('message')

        if (message.senderId === this.#userId) {
          messageElement.classList.add('message-sent')
        } else {
          messageElement.classList.add('message-received')
        }

        if (this.encryptionEnabled) {
          const decryptedMessage = this.#decryptMessage(message.data)
          messageElement.textContent = `${message.username}: ${decryptedMessage}`
        } else {
          messageElement.textContent = `${message.username}: ${escapeInput(message.data)}`
        }

        this.#messageContainer.appendChild(messageElement)
        const clearfix = document.createElement('div')
        clearfix.classList.add('clearfix')
        this.#messageContainer.appendChild(clearfix)

        // Auto-scroll to the bottom
        this.#messageContainer.scrollTop = this.#messageContainer.scrollHeight
      }
    }

    /**
     * Checks if a message was sent by the current user.
     *
     * @param {object} message - The message object.
     * @returns {boolean} True if the message was sent by the user.
     */
    isMessageSentByUser (message) {
      return message.username === this.username
    }

    /**
     * Encrypts a message using AES encryption.
     *
     * @param {string} message - The message to encrypt.
     * @returns {string} The encrypted message.
     */
    #encryptMessage (message) {
      return CryptoJS.AES.encrypt(message, this.#secretKey).toString()
    }

    /**
     * Decrypts a message using AES encryption.
     *
     * @param {string} ciphertext - The encrypted message.
     * @returns {string} The decrypted message.
     */
    #decryptMessage (ciphertext) {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.#secretKey)
      return bytes.toString(CryptoJS.enc.Utf8)
    }

    /**
     * Requests permission from the user to display notifications.
     * If granted, it displays a sample notification.
     */
    #requestNotificationPermission () {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification('Vibration Sample', {
              body: 'Buzz! Buzz!',
              icon: '../images/egg.png',
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              tag: 'vibration-sample'
            })
          })
        }
      })
    }
  }

)
