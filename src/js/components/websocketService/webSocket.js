// websocketService.js
/**
 *
 */
export class WebSocketService {
  static instance = null

  /**
   *
   * @param url
   */
  constructor (url) {
    if (WebSocketService.instance) { // Singleton
      return WebSocketService.instance
    }

    this.url = url
    /* this.apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd' */
    /* this.socket = null */
    /* this.socket = new WebSocket(this.url) */
    this.connect('eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd')
    WebSocketService.instance = this // SIngleton
  }

  messageHistory = []

  /**
   *
   * @param url
   */
  static getInstance (url) { // Singleton
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(url)
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
  connect (apiKey) {
    this.socket = new WebSocket(this.url)

    /**
     *
     */
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
      console.log('WebSocket connection closed')
      // Optional: Implement reconnection logic here
    }

    this.apiKey = apiKey
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
    /* console.log(message) */
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
  sendMessage (messageText, username, channel, senderId) {
    const message = {
      type: 'message',
      data: messageText,
      username,
      channel,
      key: this.apiKey,
      senderId/* 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd' */
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
      console.log('sending message from Socket')
    } else {
      console.error('WebSocket is not connected.')
    }
  }
  /*
    subscribers = [];

subscribe(subscriber) {
    this.subscribers.push(subscriber);
}

unsubscribe(subscriber) {
    this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
}

broadcastMessage(message) {
    this.subscribers.forEach(sub => sub.receiveMessage(message));
} */

  // Additional methods for handling specific tasks can be added here
}

export default WebSocketService
