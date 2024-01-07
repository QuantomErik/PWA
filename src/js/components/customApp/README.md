# Custom Weather Application Web Component

The Custom Weather Application web component is designed to provide real-time weather information and forecasts. It offers functionality to search for weather by city or use geolocation, display current weather conditions, and provide hourly forecasts.

## Features

- **Real-Time Weather Data**: Access current weather conditions and forecasts for any city.
- **Geolocation Support**: Automatically fetches weather data based on the user's current location.
- **Interactive UI**: A user-friendly interface with draggable and resizable components.
- **Weather Icons**: Displays weather conditions using visually appealing icons.
- **Hourly Forecast**: Shows an hourly weather forecast, enhancing user engagement.

## Components

### `customApp.js`

Manages the display and interaction of the weather application.

- **City Search**: Users can search for weather information by city name.
- **Geolocation**: Automatically fetches weather data based on the user's current location.
- **Weather Display**: Shows temperature, weather conditions, wind speed, and humidity.
- **Hourly Weather Forecast**: Displays a scrollable hourly weather forecast.
- **Customizable UI**: Draggable and resizable UI components for enhanced user experience.

## Initialization

The application initializes by setting up the UI components and waiting for user input or geolocation data.

# Usage
## Installation

Include the `customApp.js` file in your project.

```html
<script type="module" src="./js/components/customApp.js"></script>
```

## Usage Example
## Event Handling

The component can handle various events such as city searches, geolocation requests, and user interactions with the UI elements.

```html
<custom-app></custom-app>
```

Simply include the <custom-app></custom-app> tag in your HTML to render the weather application component. The component will handle the rest, from user input to displaying the weather data.

# Disclaimer Text

### `disclaimer.txt`

This file contains important information about sharing the user's location data with the application. It is displayed to the user when the application requests access to their geographical location for weather-related features.

#### Contents of `disclaimer.txt`

Share your location
Get more useful information from sites by letting them see your location. For example, by sharing your location, you can retrieve current weather conditions near you.

Let a site know your location
By default, Chrome asks you when a site wants to see your location. To let the site know where you are, choose Allow. Before sharing your location, review the site's privacy policy.

If you use Google as your default search engine on your phone, your location is used by default for your searches on Google.


#### Usage

When the `customApp` component initializes, this disclaimer is presented to the user. The user must acknowledge this disclaimer to proceed with enabling location-based services within the application.

#### Customization

To modify the disclaimer:

1. Open the `disclaimer.txt` file within the `customApp` folder.
2. Edit the text to align with your application's privacy and data use policies.

## Initialization

The application initializes by setting up the UI components and waiting for user input or geolocation data.

# Usage
## Installation

Include the `customApp.js` file in your project.

```html
<script type="module" src="./js/components/customApp.js"></script>
```




