# Message App Web Component

The Message App web component is a versatile and interactive chat application. It offers real-time messaging capabilities, message encryption, and a customizable user interface.

## Features

- **Real-Time Messaging**: Allows users to send and receive messages in real-time.
- **Message Encryption**: Option to encrypt messages for enhanced privacy.
- **Customizable User Interface**: User interface with resizable and draggable chat window.
- **Notification Support**: Browser notifications for incoming messages.
- **User Authentication**: Allows users to set and remember usernames.

## Components

### `message-app.js`

Manages the user interface and interactions for the messaging application.

- **WebSocket Integration**: Uses WebSocket for real-time communication.
- **Dynamic Message Display**: Displays incoming and outgoing messages dynamically.
- **Encryption Toggle**: Option for users to enable or disable message encryption.
- **Draggable and Resizable Chat Window**: Enhances user experience with a flexible layout.
- **User Interface Customization**: Stylish UI with CSS gradients and animations.

## Initialization

The application initializes by setting up WebSocket connections, user interface elements, and handling user input.

# Usage
## Installation

Include the `message-app.js` file in your project.

```html
<script type="module" src="./js/components/message-app.js"></script>
```

## Usage Example

```html
<message-app></message-app>
```

Simply include the <message-app></message-app> tag in your HTML. The component sets up the chat interface, handles user inputs, message sending, receiving, and optional encryption.

## Event Handling

The component handles various events such as message sending, receiving, user input, and window interactions.

# Configuration

### `config.js`

The memoryGame component relies on a configuration file named config.js for its settings.

### Contents

The config.js file contains configuration settings for the game. Currently, it includes a secret key used for certain functionalities within the game.

### Usage

The secretKey in config.js is used for specific features within the game that require encryption or other security measures.


