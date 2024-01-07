# My Flipping Tile Web Component

The `my-flipping-tile` web component provides an interactive tile that flips on user interaction. It's designed for use in memory games and other interactive applications where tile flipping is a key element.

## Features

- **Flippable Tile**: The tile can be flipped to show its front and back.
- **Customizable Appearance**: Supports custom styles for both the front and back of the tile.
- **Accessibility Support**: Can be interacted with both mouse clicks and keyboard inputs.
- **State Management**: Manages its own state such as 'face-up', 'disabled', and 'hidden'.
- **Event Handling**: Dispatches custom events on flipping.

## Components

### `my-flipping-tile.js`

Manages the behavior and appearance of a single flipping tile.

- **Interactive**: Responds to user clicks and Enter key presses to flip.
- **State Attributes**: Can be marked as 'face-up', 'disabled', or 'hidden'.
- **Event Emission**: Emits an event when the tile is flipped.

## Initialization

Upon initialization, the tile is ready for user interaction and flipping.

# Usage
## Installation

Include the `my-flipping-tile.js` file in your project.

```html
<script type="module" src="./js/components/my-flipping-tile.js"></script>
```

## Usage Example

```html
<my-flipping-tile></my-flipping-tile>
```

Add the <my-flipping-tile> tag to your HTML. You can customize its appearance using CSS and listen for its flip events in JavaScript.

# Attributes

- **face-up**: Indicates whether the tile is currently flipped up.
- **disabled**:  If present, the tile will not respond to user interactions.
- **hidden**: If present, the tile will not be visible or interactive.

## Event Handling

The component dispatches a `my-flipping-tile:flip` event when it is flipped. You can listen to this event to react to tile flips in your application.

## Customization

You can customize the appearance of the tile using CSS. The component uses Shadow DOM, so you should use the `::part` to style its parts:

- **tile-main**: The main tile element.
- **tile-front**:  The front side of the tile.
- **tile-back**: The back side of the tile.



