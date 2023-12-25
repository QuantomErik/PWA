import '../my-flipping-tile'


/*
 * Get image URLs.
 */
/* const NUMBER_OF_IMAGES = 9

const IMG_URLS = new Array(NUMBER_OF_IMAGES)
for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
  IMG_URLS[i] = (new URL(`images/${i}.png`, import.meta.url)).href
} */
const IMG_URLS = [
  new URL('./images/0.png', import.meta.url).href,
  new URL('./images/1.png', import.meta.url).href,
  new URL('./images/2.png', import.meta.url).href,
  new URL('./images/3.png', import.meta.url).href,
  new URL('./images/4.png', import.meta.url).href,
  new URL('./images/5.png', import.meta.url).href,
  new URL('./images/6.png', import.meta.url).href,
  new URL('./images/7.png', import.meta.url).href,
  new URL('./images/8.png', import.meta.url).href,
  // ... repeat for all images
];
/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>

#Window {
        position: relative; /* Needed for absolute positioning of the exit button */
        display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    max-height: 600px;
    overflow: hidden;
    margin: 20px;
    background-color: #f9f9f9;
    text-align: center;

   /*  max-width: none;
    max-height: none; */
    /* width: 400px; */
   /*  height: 400px; */
    /* overflow: hidden; */
    /* margin: 20px; */
    /* background-color: #f9f9f9; */
   /*  z-index: 1; */
    /* resize: both; */
    /* padding: 10px; */
   /*  padding-right: 10px;
    padding-left: 10px;
    padding-bottom: 10px; */
    /* justify-content: center;
      align-items: center; */
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
      /* margin-top: 1px;
      margin-bottom: 10px; */
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
    /* other styles for the button */
  }

  #completionMessage {
    text-align: center;
      color: black;
      font-size: 20px;
      /* justify-content: center;
      align-items: center; */

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
  }
  

    

    my-flipping-tile {
      width: var(--tile-size);
      height: var(--tile-size);
    }
    my-flipping-tile::part(tile-back) {
      border-width: 5px;
      background: url("${IMG_URLS[0]}") no-repeat center/80%, radial-gradient(#fff, #ffd700);;
    }
  </style>
  <div id="Window">
  <div id="dragHandle">
  <button id="exitButton">&times;</button>
  </div>
   <!-- <button id="exitButton">&times;</button> -->
   <button id="resetButton">New Game</button>
   
   <div id="menu">
  <label for="boardSizeSelect">Choose game size:</label>
  <select id="boardSizeSelect">
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

/*
 * Define custom element.
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
      * Creates an instance of the current type.
      */

     #startTime

     constructor () {
       super()

       // Attach a shadow DOM tree to this element and
       // append the template to the shadow root.
       this.attachShadow({ mode: 'open' })
         .appendChild(template.content.cloneNode(true))

       // Get the game board element in the shadow root.
       this.#gameBoard = this.shadowRoot.querySelector('#game-board')

       // Get the tile template element in the shadow root.
       this.#tileTemplate = this.shadowRoot.querySelector('#tile-template')

       this.attempts = 0
       this.#init()

      
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
      * Called after the element is inserted into the DOM.
      */
     connectedCallback () {
       if (!this.hasAttribute('boardsize')) {
         this.setAttribute('boardsize', 'large')
       }

       this.#upgradeProperty('boardsize')

       this.#gameBoard.addEventListener('my-flipping-tile:flip', () => this.#onTileFlip())
       this.addEventListener('dragstart', (event) => {
         // Disable element dragging.
         event.preventDefault()
         event.stopPropagation()
       })

       window.addEventListener('mousemove', (event) => this.handleDragMove(event))
       window.addEventListener('mouseup', () => this.handleDragEnd())
   
       const dragHandle = this.shadowRoot.getElementById('dragHandle')
       dragHandle.addEventListener('mousedown', (event) => this.handleDragStart(event))
   
       this.shadowRoot.getElementById('exitButton').addEventListener('click', () => this.closeMessageApp()) //change the name

       this.shadowRoot.getElementById('boardSizeSelect').addEventListener('change', (event) => {
        const selectedSize = event.target.value
        this.setBoardSize(selectedSize)
        this.resetGame()
      })

      this.shadowRoot.getElementById('resetButton').addEventListener('click', () => this.resetGame())

     

     
     }

  

     setBoardSize(size) {
      switch (size) {
        case '4x4':
          this.boardSize = 'large';
          break;
        case '4x2':
          this.boardSize = 'medium'
          break;
        case '2x2':
          this.boardSize = 'small'
          break;
        default:
          this.boardSize = 'large'
      }
    }

     closeMessageApp() {
      this.remove() // Removes the element from the DOM

      this.shadowRoot.getElementById('resetButton').removeEventListener('click', this.resetGame)
  }

  handleDragMove(event) {
    if (!this.isDragging) return
    this.style.position = 'absolute'
    this.style.left = `${event.clientX - this.offsetX}px`
    this.style.top = `${event.clientY - this.offsetY}px`
}

handleDragEnd() {
  this.isDragging = false;
}

handleDragStart(event) {
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


     #handleArrowKey(event, currentIndex, width, height) {
      let nextIndex = currentIndex
      const row = Math.floor(currentIndex / width)
      const col = currentIndex % width
  
      switch(event.key) {
        case 'ArrowUp':
          if (row > 0) nextIndex -= width
          break
        case 'ArrowDown':
          if (row < height - 1) nextIndex += width;
          break
        case 'ArrowLeft':
          if (col > 0) nextIndex -= 1
          break
        case 'ArrowRight':
          if (col < width - 1) nextIndex += 1
          break
        case 'Enter':
         /*  const currentTile = this.#tiles.all[currentIndex]
          if (currentTile.hasAttribute('face-up')) {
            currentTile.removeAttribute('face-up')
          } else {
            currentTile.setAttribute('face-up', '')
          } */
          
         /*  const currentTile = this.#tiles.all[currentIndex];
          if (currentTile.flip) {  // Ensure the flip method exists
            currentTile.flip();   // Call the flip method
          } */
          break
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
        tile.addEventListener('keydown', (event) => this.#handleArrowKey(event, index, width, height));
      })

      this.startTimer()
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

      console.log("Indexes before shuffle:", indexes)

      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]]
      }
      console.log("Indexes after shuffle:", indexes)
      // Set the tiles' images.
      this.#tiles.all.forEach((tile, i) => {
        tile.querySelector('img').setAttribute('src', IMG_URLS[indexes[i] % (tilesCount / 2) + 1])
        tile.faceUp = tile.disabled = tile.hidden = false
      })

      const totalBoardWidth = this.#calculateBoardWidth(width)
      const windowDiv = this.shadowRoot.querySelector('#Window');
      if (windowDiv) {
        windowDiv.style.width = `${totalBoardWidth}px`;
      }
    }

    #calculateBoardWidth(tilesInRow) {
      const tileSize = parseInt(getComputedStyle(this).getPropertyValue('--tile-size'), 10)
      const gapSize = 20 // Assuming a gap of 20px, adjust as necessary
      return (tilesInRow * tileSize) + ((tilesInRow - 1) * gapSize)
    }

    gameCompleted() {
      console.log('gameover')
      console.log(this.attempts)

      const elapsedTime = this.getElapsedTime()

      this.#displayCompletionMessage(this.attempts, elapsedTime)
      this.#gameBoard.style.display = 'none'
      const resetButton = this.shadowRoot.getElementById('resetButton');
  if (resetButton) {
    resetButton.style.display = 'block'
  }

  /* const gameIsCompleted = document.createElement('game-completed')
  this.shadowRoot.append(gameIsCompleted) */

    }

    #displayCompletionMessage(attempts, elapsedTime) {
      const message = `Total attempts: ${attempts}<br> Total time: ${elapsedTime} seconds.`
      
      // Create a new element to display the message or use an existing element
      
       
       /*  const newMessageElement = document.createElement('div')
        newMessageElement.id = 'completionMessage'
        newMessageElement.textContent = message

        
        const windowDiv = this.shadowRoot.querySelector('#Window')
        windowDiv.appendChild(newMessageElement)
 */
        let completionMessage = this.shadowRoot.querySelector('#completionMessage');
        if (!completionMessage) {
          completionMessage = document.createElement('div')
          completionMessage.id = 'completionMessage'
          const windowDiv = this.shadowRoot.querySelector('#Window')
          windowDiv.appendChild(completionMessage)
        }
        completionMessage.innerHTML = message
      

    }

    resetGame() {
      
      this.#gameBoard.style.display = ''

      this.#init()
      this.attempts = 0
      console.log('restart')

      const completionMessage = this.shadowRoot.querySelector('#completionMessage')
      if (completionMessage) {
        completionMessage.remove()
      }

      /* document.querySelector('#completionMessage').remove() */

   /*    const welcomePage = this.shadowRoot.getElementById('welcomePage') */
  /* const gameBoard = this.shadowRoot.getElementById('game-board') */

  /* if (gameBoard) {
    gameBoard.style.display = 'grid'
  } */

  /* if (welcomePage) {
    welcomePage.style.display = 'block'
  } */

      /* this.setBoardSize() */

      const tiles = this.#tiles.all;
  tiles.forEach(tile => {
    tile.removeAttribute('face-up');
    tile.removeAttribute('disabled');
    tile.removeAttribute('hidden');
  });

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
        this.attempts++
      }

      /* if (tiles.all.every(tile => tile.hidden)) {
        console.log('game completed')
        // existing code...
        alert(`Game Completed! Total Attempts: ${this.attempts}`);
        this.#init();
        console.log('game completed')
      } */

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

    startTimer() {
      this.#startTime = Date.now()
    }

    getElapsedTime() {
      const endTime = Date.now()
      return ((endTime - this.#startTime) / 1000).toFixed(2) // Elapsed time in seconds
    }

    


  }
)
