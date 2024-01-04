import { config } from "./config.js"

export class WebSocketService {
  static instance = null

  /**
   *
   * @param url
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
   *
   * @param url
   */
  static getInstance (url, apiKey) {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(url, apiKey)
    }
    return WebSocketService.instance
  }

  /**
   *
   * @param callback
   */
  addMessageListener (callback) {
    this.messageReceivedCallback = callback
  }

  /**
   *
   * @param apiKey
   */
  connect () {
    this.socket = new WebSocket(this.url)

    this.socket.onopen = () => {
      console.log('WebSocket connection established')
    }

    /**
     *
     * @param event
     */
    this.socket.onmessage = (event) => {
      this.handleMessage(event)
    }

    /**
     *
     * @param error
     */
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    /**
     *
     */
    this.socket.onclose = () => {
      console.log('WebSocket connection closed. Attempting to reconnect... ')
      setTimeout(() => {
        this.connect()
      }, 5000)
    }

  }

  /**
   *
   * @param event
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
   *
   */
  getMessagesHistory () {
    return this.messageHistory
  }

  /**
   *
   * @param callback
   */
  onMessageReceived (callback) {
    this.messageReceivedCallback = callback
    console.log('MessageReceived')
  }

  /**
   *
   * @param messageText
   * @param username
   * @param channel
   * @param senderId
   */
  sendMessage (messageText, username, channel) {
    const message = {
      type: 'message',
      data: messageText,
      username,
      channel,
      key: this.apiKey,
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
      console.log('sending message from Socket')
    } else {
      console.error('WebSocket is not connected.')
    }
  }
}

