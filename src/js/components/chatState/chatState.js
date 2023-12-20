// chatState.js
class ChatState {
    constructor() {
        this.messages = [];
    }

    addMessage(message) {
        this.messages.push(message);
    }

    getMessages() {
        return this.messages;
    }
}

export const chatState = new ChatState();
