# Memory Game Web Component

The Memory Game web component offers an interactive and customizable memory match game. It provides a fun and engaging way to test memory skills with various board sizes and a set of unique image pokemon tiles.

## Features

- **Customizable Board Size**: Choose from multiple board sizes (e.g., 4x4, 4x2, 2x2).
- **Interactive Tiles**: Clickable tiles that flip to reveal images.
- **Game State Management**: Manages the game state, including matching tiles and tracking attempts.
- **Keyboard Navigation**: Supports keyboard navigation for accessibility.
- **Performance Optimized**: Lazy-loads images for optimal performance.

## Components

### `memorygame.js`

Manages the game logic and user interactions for the memory game.

- **Dynamic Board Creation**: Dynamically creates the game board based on the selected size.
- **Tile Matching Logic**: Handles the logic for matching pairs of tiles.
- **Game Completion Detection**: Detects when the game is completed and displays a message.
- **Reset Functionality**: Allows the game to be reset and played again.

## Initialization

The game initializes with a default board size and can be customized via attributes.

# Usage
## Installation

Include the `memorygame.js` file in your project.

```html
<script type="module" src="./js/components/memoryGame.js"></script>
```

# Usage Example

```html
<memory-game boardsize="4x4"></memory-game>
```

Add the <memory-game> tag to your HTML with an optional boardsize attribute to specify the size of the game board. The component handles the creation of tiles and game logic.

# Attributes

boardsize: Specifies the size of the game board. Accepted values are '4x4' (default), '4x2', and '2x2'.

## Event Handling

The component emits custom events for game actions such as tile flips, matches, mismatches, and game completion.


