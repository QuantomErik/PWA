// websocketService.js
export class WebSocketService {
    /* static instance = null
 */
    constructor(url) {

       /*  if (WebSocketService.instance) { //Singleton
            return WebSocketService.instance;
        } */

        this.url = url
        this.socket = null
       /*  WebSocketService.instance = this */ //SIngleton

        
    }



   /*  static getInstance(url) { // Singleton
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService(url);
        }
        return WebSocketService.instance;
    } */

    addMessageListener(callback) {
        this.messageReceivedCallback = callback
    }

    connect(apiKey) {
        this.socket = new WebSocket(this.url)

        this.socket.onopen = () => {
            console.log('WebSocket connection established')
        }

        this.socket.onmessage = (event) => {
            this.handleMessage(event)
        }

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        this.socket.onclose = () => {
            console.log('WebSocket connection closed')
            // Optional: Implement reconnection logic here
        }

        this.apiKey = apiKey
    }

    handleMessage(event) {
        const message = JSON.parse(event.data)
        window.dispatchEvent(new CustomEvent('message-received', { detail: message }))
        if (this.messageReceivedCallback) {
            this.messageReceivedCallback(message)
        }
        /* console.log(message) */
        console.log('handlemessage')
    }

    onMessageReceived(callback) {
        this.messageReceivedCallback = callback
        console.log('MessageReceived')
    }

    sendMessage(messageText, username, channel) {
        const message = {
            type: 'message',
            data: messageText,
            username: username,
            channel: channel,
            key: this.apiKey/* 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd' */
        }

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message))
            console.log('sending message from Socket')
        } else {
            console.error('WebSocket is not connected.')
        }
    }

    // Additional methods for handling specific tasks can be added here
}

export default WebSocketService
