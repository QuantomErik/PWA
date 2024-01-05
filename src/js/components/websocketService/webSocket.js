import { config } from './config.js'

/**
 * Class representing a singleton WebSocket service for managing WebSocket connections.
 */
export class WebSocketService {
  static instance = null

  /**
   * Creates an instance of WebSocketService or returns the existing instance.
   * Manages WebSocket connections and message handling.
   *
   * @param {string} url - The WebSocket server URL.
   */
  constructor (url) {
    if (WebSocketService.instance) {
      return WebSocketService.instance
    }
    this.messageHistory = []
    this.url = url
    this.apiKey = config.apiKey
    this.connect()
    WebSocketService.instance = this
  }

  /**
   * Returns the singleton instance of the WebSocketService.
   *
   * @param {string} url - The WebSocket server URL.
   * @param {string} apiKey - The API key for the WebSocket connection.
   * @returns {WebSocketService} The singleton instance of the WebSocketService.
   */
  static getInstance (url, apiKey) {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(url, apiKey)
    }
    return WebSocketService.instance
  }

  /**
   * Registers a callback function to be executed when a message is received.
   *
   * @param {Function} callback - The callback function to handle messages.
   */
  addMessageListener (callback) {
    this.messageReceivedCallback = callback
  }

  /**
   * Establishes a WebSocket connection with the server.
   */
  connect () {
    this.socket = new WebSocket(this.url)

    /**
     * Event handler for when the WebSocket connection is successfully established.
     * Logs the status to the console.
     */
    this.socket.onopen = () => {
      console.log('WebSocket connection established')
    }

    /**
     * Event handler for receiving a message from the WebSocket.
     * Passes the event to the handleMessage method for further processing.
     *
     * @param {MessageEvent} event - The message event containing the received message.
     */
    this.socket.onmessage = (event) => {
      this.handleMessage(event)
    }

    /**
     * Event handler for any errors that occur with the WebSocket.
     * Logs the error details to the console.
     *
     * @param {Event} error - The event object containing error details.
     */
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    /**
     * Event handler for when the WebSocket connection is closed.
     * Attempts to reconnect after a specified timeout.
     */
    this.socket.onclose = () => {
      console.log('WebSocket connection closed. Attempting to reconnect... ')
      setTimeout(() => {
        this.connect()
      }, 5000)
    }
  }

  /**
   * Handles incoming WebSocket messages.
   *
   * @param {MessageEvent} event - The message event containing the received message.
   */
  handleMessage (event) {
    const message = JSON.parse(event.data)

    this.messageHistory.push(message)
    if (this.messageHistory.length > 30) {
      this.messageHistory.shift()
    }

    window.dispatchEvent(new CustomEvent('message-received', { detail: message }))
    if (this.messageReceivedCallback) {
      this.messageReceivedCallback(message)
    }
    console.log('handlemessage')
  }

  /**
   * Returns the history of received messages.
   *
   * @returns {Array} An array of received messages.
   */
  getMessagesHistory () {
    return this.messageHistory
  }

  /**
   * Registers a callback function to be executed when a message is received.
   *
   * @param {Function} callback - The callback function to handle messages.
   */
  onMessageReceived (callback) {
    this.messageReceivedCallback = callback
    console.log('MessageReceived')
  }

  /**
   * Sends a message via the WebSocket connection.
   *
   * @param {string} messageText - The text of the message to be sent.
   * @param {string} username - The username of the sender.
   * @param {string} channel - The channel to which the message is sent.
   * @param {string} senderId - A unique identifier for the sender of the message.
   */
  sendMessage (messageText, username, channel, senderId) {
    const message = {
      type: 'message',
      data: messageText,
      username,
      channel,
      key: this.apiKey,
      senderId
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
      console.log('sending message from Socket')
    } else {
      console.error('WebSocket is not connected.')
    }
  }
}
