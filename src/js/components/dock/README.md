# Application Dock Web Component

The Application Dock web component is designed to provide a user-friendly interface for launching various applications like Memory Game, Messages App, and Weather App. It features an interactive dock with icons for each application and supports keyboard navigation for accessibility.

## Features

- **Interactive Icons**: Easy-to-use icons for launching different applications.
- **Keyboard Navigation**: Supports arrow key navigation for accessibility.
- **Loading Indicator**: Visual feedback when applications are loading.
- **Customizable Design**: Flexibility to add or remove application icons as needed.
- **Fixed Positioning**: Dock is fixed on the screen for easy access.

## Components

### `dock.js`

Manages the display and interaction of the application dock.

- **Application Icons**: Icons for launching Memory Game, Messages App, and Weather App.
- **Event Handling**: Listens for click and keypress events to open applications.
- **Dynamic Loading**: Loads applications dynamically on demand to optimize performance.
- **Accessibility**: Keyboard navigation for users who prefer or require keyboard use.

## Initialization

The dock initializes by setting up icons for each application and listening for user interactions.

# Usage
## Installation

Include the `dock.js` file in your project.

```html
<script type="module" src="./js/components/dock.js"></script>
```

## Usage Example
## Event Handling

The dock component listens for user clicks and keypresses to launch the respective applications.

```html
<app-dock></app-dock>
```

Simply include the <app-dock></app-dock> tag in your HTML. This will render the application dock with icons for the Memory Game, Messages App, and Weather App. Clicking on an icon or pressing 'Enter' while focused on an icon will launch the respective application.