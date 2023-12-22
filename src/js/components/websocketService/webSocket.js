// websocketService.js
export class WebSocketService {
    static instance = null

    constructor(url) {

        if (WebSocketService.instance) { //Singleton
            return WebSocketService.instance;
        }

        this.url = url
        /* this.apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd' */
        /* this.socket = null */
        /* this.socket = new WebSocket(this.url) */
        this.connect('eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd')
        WebSocketService.instance = this //SIngleton

        
    }

    messageHistory = []

    static getInstance(url) { // Singleton
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService(url);
        }
        return WebSocketService.instance;
    }

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

    getMessagesHistory() {
        return this.messageHistory
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
