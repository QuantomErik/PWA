# QuantumApplication

## Overview

QuantumApplication is a Progressive Web App (PWA) that includes a dock, a chat application, a memory game, and a weather application. This project showcases a multi-functional PWA with a focus on interactive and dynamic user interfaces.

## Features

- **Dock**: A floating dock for quick access to different applications.
- **Chat Application**: A real-time chat application with optional message encryption.
- **Memory Game**: A classic memory game with adjustable board sizes.
- **Weather Application**: A weather forecast application with geolocation support and dynamic weather icons.

## Components

### customApp.js

This file contains the weather application logic. It fetches weather data using the OpenWeatherMap API and displays it with appropriate icons.

- **Weather Icons**: 
  - Magnifying glass: `images/magnifying-glass.png`
  - Position: `images/position.png`
  - Error: `images/error.png`
  - Snow: `images/snowing.png`
  - Clouds: `images/cloud.png`
  - Mist: `images/rain-drops.png`
  - Haze: `images/cloudy-day.png`
  - Clear: `images/sun.png`
  - Rain: `images/raining.png`
  - Sunny: `images/sun.png`
  - Wind: `images/wind.png`
  - Humidity: `images/droplet.png`

### dock.jsx

This component is responsible for the dock interface, allowing users to launch different applications (memory game, chat app, and weather app).

- **Dock Icons**:
  - Memory Game: `images/memory-game.png`
  - Chat: `images/chat-box.png`
  - Weather: `images/weather-app.png`

### memorygame.js

This file contains the logic for the memory game. It includes dynamic board sizes and an interactive UI.

- **Game Images**: 
  - 0.png to 8.png in `images/`

### messageapp.js

The chat application supports real-time messaging and optional message encryption using CryptoJS.

- **Chat Icons**:
  - Open Data: `images/open-data.png`
  - Encrypted Data: `images/encrypted-data.png`

### myflippingtile.js

Defines the custom `my-flipping-tile` element used in the memory game.

### websocket.js

Handles the WebSocket connection for the chat application, ensuring real-time communication.

### index.js

The main entry point of the application. It initializes the dock and handles application window creation.

### manifest.json

Defines the PWA's manifest, including metadata like name, icons, and start URL.

### serviceworker.js

A service worker that handles caching, fetch events, and push notifications to ensure offline functionality and improved performance.

## Getting Started

To get started with QuantumApplication, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/QuantomErik/PWA.git
   cd PWA

2. **Install dependencies**:
   npm install

3. **Run the application**:
   npm start

4. **Open the application**:
   Open your browser and navigate to http://localhost:3000.

### Usage
  - Use the dock on the right side of the screen to launch the Memory Game, Chat App, or Weather App.
  - In the chat application, toggle the encryption checkbox to enable or disable message encryption.
  - Use the search bar in the weather application to find weather information for different cities or use geolocation.

### Acknowledgements
  - Weather data provided by OpenWeatherMap.
  - Icons and images used in the project are from various free resources.

### Author
QuantumApplication is developed by Erik Yang](erikyang@hotmail.com).
