# WebSocket Service for Messaging Application

The WebSocket Service is a key component of the messaging application, handling real-time WebSocket connections for sending and receiving messages.

## Features

- **Singleton Pattern**: Ensures only a single instance of the WebSocket service is created.
- **Real-Time Communication**: Manages WebSocket connections for real-time messaging.
- **Message History**: Maintains a history of received messages.
- **Event Handling**: Dispatches events and handles messages received from the WebSocket.
- **Notification Support**: Displays browser notifications for incoming messages.

## Details

### `WebSocketService`

This class manages WebSocket connections, message sending, and receiving. It utilizes the singleton pattern to ensure a single WebSocket connection is maintained throughout the application's lifecycle.

#### Methods

- **connect**: Establishes a WebSocket connection with the server.
- **sendMessage**: Sends a message via the WebSocket.
- **addMessageListener**: Registers a callback to be executed when a message is received.
- **getMessagesHistory**: Returns the history of received messages.

#### Events

- **message-received**: Dispatched when a new message is received from the WebSocket.

#### Configuration

The service uses a configuration file (`config.js`) to manage settings like the API key.

## Usage

The service is automatically initialized when imported into a component. It handles WebSocket connections and exposes methods to interact with the WebSocket.

## Installation

Include the service in your messaging application:

```javascript
import { WebSocketService } from './path/to/websocketService.js'
```

## Example

```javascript
const wsService = WebSocketService.getInstance(url, apiKey);
wsService.addMessageListener((message) => {
  // Handle incoming message
})
```

## Configuration

### `config.js`

The service uses a configuration file named `config.js` to manage essential settings.

#### Contents

The `config.js` file contains configuration settings for the WebSocket service. Currently, it includes the API key used for WebSocket connections.

### Usage

The `apiKey` in `config.js` is used to authenticate the WebSocket connection.


