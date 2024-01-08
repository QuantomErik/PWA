/**
 * The memory game web component.
 *
 * @author // Erik Yang <ey222ci@student.lnu.se>
 * @version 1.0.0
 */

import '../my-flipping-tile'

/*
 * Get image URLs.
 */
const NUMBER_OF_IMAGES = 9
const IMG_URLS = []

for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
  IMG_URLS.push(new URL(`./images/${i}.png`, import.meta.url).href)
}

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>

#Window {
        position: relative;
        display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    max-height: 600px;
    overflow: hidden;
    margin: 20px;
    
    background: linear-gradient(to right, #b0bbe7 0%, #1f2e5c 100%);
    text-align: center;

    }

    :host {
      --tile-size: 80px;
    }

    #game-board {
      display: grid;
      grid-template-columns: repeat(4, var(--tile-size));
      gap: 20px;
      justify-content: center;
      align-items: center;
    }
    #game-board.small {
      grid-template-columns: repeat(2, var(--tile-size));
    }

    #exitButton {
      position: absolute;
      right: 1px;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 30px;
      color: white;
    }

    #resetButton {
    display: none;
    border-radius: 10px;
    padding: 10px;
    background-color: green;
    color: white;
    cursor: pointer;
    width: 150px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }

  #completionMessage {
    text-align: center;
      color: black;
      font-size: 20px;
  }

  #dragHandle {
    margin-bottom: 5px;
    background-color: orange;
    color: transparent;
    width: 100%;
    height: 30px;
    align-items: center; 
    display: flex; 
    justify-content: center;
  }

  #menu {
    margin-bottom: 5px;
    position: absolute;
    top: 5px;
    left: 5px;
  }

    my-flipping-tile {
      width: var(--tile-size);
      height: var(--tile-size);
    }
    my-flipping-tile::part(tile-back) {
      border-width: 5px;
      background: url("${IMG_URLS[0]}") no-repeat center/80%, radial-gradient(#fff, #031a8b);;
    }
  </style>
  <div id="Window">
  <div id="dragHandle">
  <button id="exitButton">&times;</button>
  </div>
   
   <button id="resetButton">New Game</button>
   
   <div id="menu">
  
  <select id="boardSizeSelect" class="hidden">
    <option value="4x4">4x4</option>
    <option value="4x2">4x2</option>
    <option value="2x2">2x2</option>
  </select>
  </div>
  

  <template id="tile-template">
    <my-flipping-tile>
      <img />
    </my-flipping-tile>
  </template>
  <div id="game-board">
  </div>

   </div>

     
`

/**
 * @class MemoryGame
 * @augments HTMLElement
 * Represents a memory game with a configurable board size and interactive tiles.
 */
customElements.define('memory-game',

  /**
   * Represents a memory game
   */
  class extends HTMLElement {
    /**
     * The game board element.
     *
     * @type {HTMLDivElement}
     */
    #gameBoard

    /**
     * The tile template element.
     *
     * @type {HTMLTemplateElement}
     */
    #tileTemplate

    /**
     *
     */

    #startTime

    /**
     *
     */

    #attempts
    /**
     * Creates an instance of the current type.
     */

    #dragHandle
    #controller
    #exitButton
    #resetButton
    #boardSizeSelect

    /**
     * Initializes the memory game component, sets up the shadow DOM, and queries necessary DOM elements.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the game board element in the shadow root.
      this.#gameBoard = this.shadowRoot.querySelector('#game-board')

      // Get the tile template element in the shadow root.
      this.#tileTemplate = this.shadowRoot.querySelector('#tile-template')

      this.#attempts = 0
      this.#init()

      this.#controller = new AbortController()
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.#initializeElements()
      this.#initializeEventListeners()
      this.#handleGameStart()
    }

    /**
     * Lifecycle method called when the component is removed from the DOM.
     */
    disconnectedCallback () {
      this.#controller.abort()
    }

    /**
     * Initializes and assigns DOM elements to class properties.
     * This method queries the component's shadow DOM and assigns references to various elements required for the component's functionality.
     */
    #initializeElements () {
      this.#dragHandle = this.shadowRoot.querySelector('#dragHandle')
      this.#exitButton = this.shadowRoot.querySelector('#exitButton')
      this.#resetButton = this.shadowRoot.querySelector('#resetButton')
      this.#boardSizeSelect = this.shadowRoot.querySelector('#boardSizeSelect')
    }

    /**
     * Initializes all the event listeners for the memory game component.
     *
     * This method attaches various event listeners to different elements within the component
     * It utilizes an AbortSignal from an AbortController to manage the cleanup of these listeners
     * when the component is disconnected, which helps in preventing potential memory leaks.
     *
     * Event listeners include:
     * - Mouse movement and release events for drag functionality.
     * - Click events for the exit button to close the app and the reset button to restart the game.
     * - Change event on the board size selection to adjust the game's board size.
     * - Custom tile flip event on the game board to handle tile interactions.
     */
    #initializeEventListeners () {
      const { signal } = this.#controller

      window.addEventListener('mouseup', () => this.#handleDragEnd(), { signal })
      window.addEventListener('mousemove', (event) => this.#handleDragMove(event), { signal })
      this.#resetButton.addEventListener('click', () => this.#resetGame(), { signal })
      this.#exitButton.addEventListener('click', () => this.closeMemoryApp(), { signal })
      this.#gameBoard.addEventListener('my-flipping-tile:flip', () => this.#onTileFlip(), { signal })
      this.#dragHandle.addEventListener('mousedown', (event) => this.#handleDragStart(event), { signal })
      this.#boardSizeSelect.addEventListener('change', (event) => this.#handleBoardSizeChange(event), { signal })
    }

    /**
     * Initializes the game when the component is connected.
     * It sets the board size to 'large' if no size is specified.
     * This method also ensures that any property value set before the element was upgraded is correctly reflected.
     */
    #handleGameStart () {
      if (!this.hasAttribute('boardsize')) {
        this.setAttribute('boardsize', 'large')
      }

      this.#upgradeProperty('boardsize')
    }

    /**
     * Handles changes in the board size based on user selection.
     * It sets the new board size and resets the game to reflect the change.
     *
     * @param {Event} event - The event object, used to determine the selected board size.
     */
    #handleBoardSizeChange (event) {
      const selectedSize = event.target.value
      this.#setBoardSize(selectedSize)
      this.#resetGame()
    }

    /**
     * Gets the board size.
     *
     * @returns {string} The size of the game board.
     */
    get boardSize () {
      return this.getAttribute('boardsize')
    }

    /**
     * Sets the board size.
     *
     * @param {string} value - The size of the game board.
     */
    set boardSize (value) {
      this.setAttribute('boardsize', value)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['boardsize']
    }

    /**
     * Get the game board size dimensions.
     *
     * @returns {object} The width and height of the game board.
     */
    get #gameBoardSize () {
      const gameBoardSize = {
        width: 4,
        height: 4
      }

      switch (this.boardSize) {
        case 'small' : {
          gameBoardSize.width = gameBoardSize.height = 2
          break
        }

        case 'medium' : {
          gameBoardSize.height = 2
          break
        }
      }

      return gameBoardSize
    }

    /**
     * Get all tiles.
     *
     * @returns {object} An object containing grouped tiles.
     */
    get #tiles () {
      const tiles = Array.from(this.#gameBoard.children)
      return {
        all: tiles,
        faceUp: tiles.filter(tile => tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        faceDown: tiles.filter(tile => !tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        hidden: tiles.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Sets the size of the game board based on the provided size string.
     *
     * @param {string} size - The size of the game board (e.g., '4x4', '4x2', '2x2').
     */
    #setBoardSize (size) {
      switch (size) {
        case '4x4':
          this.boardSize = 'large'
          break
        case '4x2':
          this.boardSize = 'medium'
          break
        case '2x2':
          this.boardSize = 'small'
          break
        default:
          this.boardSize = 'large'
      }
    }

    /**
     * Closes and removes the memory app component.
     */
    closeMemoryApp () {
      this.remove()

      this.shadowRoot.getElementById('resetButton').removeEventListener('click', this.#resetGame)
    }

    /**
     * Handles the movement during a drag event.
     *
     * @param {Event} event - The event object associated with the drag movement.
     */
    #handleDragMove (event) {
      if (!this.isDragging) return
      this.style.position = 'absolute'
      this.style.left = `${event.clientX - this.offsetX}px`
      this.style.top = `${event.clientY - this.offsetY}px`
    }

    /**
     * Handles the end of a drag event.
     */
    #handleDragEnd () {
      this.isDragging = false
    }

    /**
     * Handles the start of a drag event.
     *
     * @param {Event} event - The event object associated with the drag start.
     */
    #handleDragStart (event) {
      this.isDragging = true
      this.offsetX = event.clientX - this.getBoundingClientRect().left
      this.offsetY = event.clientY - this.getBoundingClientRect().top

      // Set width and height explicitly
      this.style.width = `${this.offsetWidth}px`
      this.style.height = `${this.offsetHeight}px`
      event.preventDefault()
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'boardsize') {
        this.#init()
      }
    }

    /**
     * Run the specified instance property through the class setter.
     *
     * @param {string} prop - The property's name.
     */
    #upgradeProperty (prop) {
      if (Object.hasOwnProperty.call(this, prop)) {
        const value = this[prop]
        delete this[prop]
        this[prop] = value
      }
    }

    /**
     * Handles arrow key navigation on the game board.
     *
     * @param {KeyboardEvent} event - The keyboard event triggered by key press.
     * @param {number} currentIndex - The current index of the focused tile.
     * @param {number} width - The width of the game board.
     * @param {number} height - The height of the game board.
     * @private
     */
    #handleArrowKey (event, currentIndex, width, height) {
      let nextIndex = currentIndex
      const row = Math.floor(currentIndex / width)
      const col = currentIndex % width

      switch (event.key) {
        case 'ArrowUp':
          if (row > 0) nextIndex -= width
          break
        case 'ArrowDown':
          if (row < height - 1) nextIndex += width
          break
        case 'ArrowLeft':
          if (col > 0) nextIndex -= 1
          break
        case 'ArrowRight':
          if (col < width - 1) nextIndex += 1
          break
            /* case 'Enter':

              break */
      }

      if (nextIndex !== currentIndex) {
        this.#tiles.all[nextIndex].focus()
        event.preventDefault()
      }
    }

    /**
     * Initializes the game board size and tiles.
     */
    #init () {
      this.#tiles.all.forEach((tile, index) => {
        tile.tabIndex = 0 // Make the tile focusable
        tile.addEventListener('keydown', (event) => this.#handleArrowKey(event, index, width, height))
      })

      this.#startTimer()
      const { width, height } = this.#gameBoardSize

      const tilesCount = width * height

      if (tilesCount !== this.#tiles.all.length) {
        // Remove existing tiles, if any.
        while (this.#gameBoard.firstChild) {
          this.#gameBoard.removeChild(this.#gameBoard.lastChild)
        }

        if (width === 2) {
          this.#gameBoard.classList.add('small')
        } else {
          this.#gameBoard.classList.remove('small')
        }

        // Add tiles.
        for (let i = 0; i < tilesCount; i++) {
          const tile = this.#tileTemplate.content.cloneNode(true)
          this.#gameBoard.appendChild(tile)
        }
      }

      // Create a sequence of numbers between 0 and 15,
      // and then shuffle the sequence.
      const indexes = [...Array(tilesCount).keys()]

      console.log('Indexes before shuffle:', indexes)

      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]]
      }
      console.log('Indexes after shuffle:', indexes)
      // Set the tiles' images.
      this.#tiles.all.forEach((tile, i) => {
        tile.querySelector('img').setAttribute('src', IMG_URLS[indexes[i] % (tilesCount / 2) + 1])
        tile.faceUp = tile.disabled = tile.hidden = false
      })

      const totalBoardWidth = this.#calculateBoardWidth(width)
      const windowDiv = this.shadowRoot.querySelector('#Window')
      if (windowDiv) {
        windowDiv.style.width = `${totalBoardWidth}px`
      }
    }

    /**
     * Calculates the total board width based on the number of tiles in a row.
     *
     * @param {number} tilesInRow - Number of tiles in a row.
     * @returns {number} Calculated board width.
     * @private
     */
    #calculateBoardWidth (tilesInRow) {
      const tileSize = parseInt(getComputedStyle(this).getPropertyValue('--tile-size'), 10)
      const gapSize = 20
      return (tilesInRow * tileSize) + ((tilesInRow - 1) * gapSize)
    }

    /**
     * Called when the game is completed. It calculates and displays the total attempts and elapsed time, and shows the reset button.
     */
    gameCompleted () {
      const elapsedTime = this.#getElapsedTime()

      this.#displayCompletionMessage(this.#attempts, elapsedTime)
      this.#gameBoard.style.display = 'none'
      const resetButton = this.shadowRoot.getElementById('resetButton')
      if (resetButton) {
        resetButton.style.display = 'block'
      }
    }

    /**
     * Displays a completion message when the game is completed.
     *
     * @param {number} attempts - Number of attempts made by the player.
     * @param {number} elapsedTime - Total time taken by the player.
     * @private
     */
    #displayCompletionMessage (attempts, elapsedTime) {
      const message = `Total attempts: ${attempts}<br> Total time: ${elapsedTime} seconds.`

      let completionMessage = this.shadowRoot.querySelector('#completionMessage')
      if (!completionMessage) {
        completionMessage = document.createElement('div')
        completionMessage.id = 'completionMessage'
        const windowDiv = this.shadowRoot.querySelector('#Window')
        windowDiv.appendChild(completionMessage)
      }
      completionMessage.innerHTML = message
    }

    /**
     * Resets the game to its initial state.
     */
    #resetGame () {
      this.#gameBoard.style.display = ''

      this.#init()
      this.#attempts = 0

      const completionMessage = this.shadowRoot.querySelector('#completionMessage')
      if (completionMessage) {
        completionMessage.remove()
      }

      const tiles = this.#tiles.all
      tiles.forEach(tile => {
        tile.removeAttribute('face-up')
        tile.removeAttribute('disabled')
        tile.removeAttribute('hidden')
      })

      const resetButton = this.shadowRoot.getElementById('resetButton')
      if (resetButton) {
        resetButton.style.display = 'none'
      }
    }

    /**
     * Handles flip events.
     */
    #onTileFlip () {
      const tiles = this.#tiles
      const tilesToDisable = Array.from(tiles.faceUp)

      if (tiles.faceUp.length > 1) {
        tilesToDisable.push(...tiles.faceDown)
        this.#attempts++
      }

      tilesToDisable.forEach(tile => (tile.setAttribute('disabled', '')))

      const [first, second, ...tilesToEnable] = tilesToDisable

      if (second) {
        const isEqual = first.isEqual(second)
        const delay = isEqual ? 1000 : 1500
        window.setTimeout(() => {
          let eventName = 'memory-game:tiles-mismatch'
          if (isEqual) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            eventName = 'memory-game:tiles-match'
          } else {
            first.removeAttribute('face-up')
            second.removeAttribute('face-up')
            tilesToEnable.push(first, second)
          }

          this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: { first, second }
          }))

          if (tiles.all.every(tile => tile.hidden)) {
            tiles.all.forEach(tile => (tile.disabled = true))
            this.dispatchEvent(new CustomEvent('memory-game:game-over', {
              bubbles: true
            }))
            this.gameCompleted()
            this.#init()
          } else {
            tilesToEnable?.forEach(tile => (tile.removeAttribute('disabled')))
          }
        }, delay)
      }
    }

    /**
     * Starts the timer for the game.
     */
    #startTimer () {
      this.#startTime = Date.now()
    }

    /**
     * Calculates the elapsed time since the timer was started.
     *
     * @returns {number} Elapsed time in seconds.
     */
    #getElapsedTime () {
      const endTime = Date.now()
      return ((endTime - this.#startTime) / 1000).toFixed(2) // Elapsed time in seconds
    }
  }
)
