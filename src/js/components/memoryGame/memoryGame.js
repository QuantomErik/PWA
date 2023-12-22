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
/* #Window, #dragHandle, #game-board {
  border: 1px solid red; 
} */

#resetButton {
    display: none;
    /* other styles for the button */
  }

#exitButton {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 20px;
      color: #333;
    }

    #dragHandle {
    background-color: #f0f0f0;
    padding: 5px;
    cursor: move;
    /* text-align: center; */
    /* width: 400px;
    box-sizing: border-box;
    margin-left: 0px;
  } */}

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
    /* background-color: #f9f9f9; */
    /* align-items: stretch; */
    padding: 0;
   /*  align-items: center; */
    /* justify-content: center; */
    }

    :host {
      --tile-size: 80px;
    }
    #game-board {
      display: grid;
      grid-template-columns: repeat(4, var(--tile-size));
      gap: 20px;
      /* width: 100%; */
      width: 400px; 
      justify-content: center;
      align-items: center;
      /* text-align: center; */
      /* max-width: 400px; */
    }
    #game-board.small {
      grid-template-columns: repeat(2, var(--tile-size));
    }
    my-flipping-tile {
      width: var(--tile-size);
      height: var(--tile-size);
    }
    my-flipping-tile::part(tile-back) {
      border-width: 5px;
      background: url("${IMG_URLS[0]}") no-repeat center/80%, radial-gradient(#fff, #ffd700);;
    }

    #menu {
      align-items: center;
      text-align: center;
    }

   


  </style>
   <div id="Window">
   <div id="dragHandle">Drag Me</div>
   <button id="exitButton">X</button>
   <button id="resetButton">New Game</button>

   <div id="menu">
  <label for="boardSizeSelect">Choose game size:</label>
  <select id="boardSizeSelect">
    <option value="4x4">4x4</option>
    <option value="4x2">4x2</option>
    <option value="2x2">2x2</option>
  </select>

   <template id="tile-template">
    <my-flipping-tile>
      <img />
    </my-flipping-tile>
  </template>
  <div id="game-board">
  </div>
   <!-- <div id="welcomePage"> -->
   <!--  <h1>Welcome to the Memory Game!</h1> -->
    <!-- <button id="startGameButton">Start Game</button> -->
   <!--  <button class="difficultyButton" data-size="2x2">Easy</button>
    <button class="difficultyButton" data-size="4x2">Medium</button>
    <button class="difficultyButton" data-size="4x4">Difficult</button>
  </div> -->
  </div>

  <!-- <div id="dragHandle">Drag Me</div> -->
  <!-- <button id="exitButton">X</button> -->

  

  <!-- <div id="menu">
  <label for="boardSizeSelect">Choose game size:</label>
  <select id="boardSizeSelect">
    <option value="4x4">4x4</option>
    <option value="4x2">4x2</option>
    <option value="2x2">2x2</option>
  </select> -->
  
</div>

 
 <!--  <template id="tile-template">
    <my-flipping-tile>
      <img />
    </my-flipping-tile>
  </template>
  <div id="game-board">
  </div> -->
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

       this.isDragging = false
       this.offsetX = 0
       this.offsetY = 0

       this.attempts = 0
     }

     handleDragMove(event) {
      if (!this.isDragging) return;
  
      // Calculate new position
      let newX = event.clientX - this.offsetX
      let newY = event.clientY - this.offsetY
  
      // Get window dimensions
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
  
      // Get dimensions of the element
      const elementWidth = this.offsetWidth
      const elementHeight = this.offsetHeight
  
      // Boundary checks
      newX = Math.min(windowWidth - elementWidth, Math.max(0, newX))
      newY = Math.min(windowHeight - elementHeight, Math.max(0, newY))
  
      // Set new position
      this.style.position = 'absolute'
      this.style.left = `${newX}px`
      this.style.top = `${newY}px`
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

  handleDragMove(event) {
      if (!this.isDragging) return
      this.style.position = 'absolute'
      this.style.left = `${event.clientX - this.offsetX}px`
      this.style.top = `${event.clientY - this.offsetY}px`
  }

  handleDragEnd() {
      this.isDragging = false;
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

    this.shadowRoot.getElementById('resetButton').addEventListener('click', () => this.resetGame())

    this.shadowRoot.getElementById('boardSizeSelect').addEventListener('change', (event) => {
      const selectedSize = event.target.value
      this.setBoardSize(selectedSize)
    })

   /*  const difficultyButtons = this.shadowRoot.querySelectorAll('.difficultyButton');
  difficultyButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const size = event.target.getAttribute('data-size')
      this.setBoardSize(size);
      this.startGame()
    });
  }); */

    /* const startGameButton = this.shadowRoot.getElementById('startGameButton');
  startGameButton.addEventListener('click', () => {
    this.startGame();
  }); */

    /* this.shadowRoot.getElementById('startGameButton').addEventListener('click', () => {
      const selectedSize = this.shadowRoot.getElementById('boardSizeSelect').value;
      this.setBoardSize(selectedSize);
      this.resetGame();
    }); */
    
     }

     

     disconnectedCallback () {
      this.shadowRoot.getElementById('exitButton').removeEventListener('click', this.closeMessageApp)

      
    window.removeEventListener('mousemove', this.handleDragMove)
    window.removeEventListener('mouseup', this.handleDragEnd)
     }

     closeMessageApp() {
      this.remove() // Removes the element from the DOM

      this.shadowRoot.getElementById('resetButton').removeEventListener('click', this.resetGame)
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
     * Initializes the game board size and tiles.
     */
    #init () {
      

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

      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]]
      }

      // Set the tiles' images.
      this.#tiles.all.forEach((tile, i) => {
        tile.querySelector('img').setAttribute('src', IMG_URLS[indexes[i] % (tilesCount / 2) + 1])
        tile.faceUp = tile.disabled = tile.hidden = false
      })
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

     

      if (tiles.all.every(tile => tile.hidden)) {
        // existing code...
        alert(`Game Over! Total Attempts: ${this.attempts}`);
        this.#init();
        console.log('game completed')
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

            console.log("Tiles:", this.#tiles.all); //debugg
  console.log("All tiles hidden:", this.#tiles.all.every(tile => tile.hidden)) //debugg
 
            this.gameCompleted()
            this.#init()
          } else {
            tilesToEnable?.forEach(tile => (tile.removeAttribute('disabled')))
          }
        }, delay)
      }
    }

    resetGame() {
      
      this.#gameBoard.style.display = ''

      this.#init();
      this.attempts = 0;
      console.log('restart')

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

    setBoardSize(size) {
      switch (size) {
        case '4x4':
          this.boardSize = 'large'; // Assuming 'large' is for 4x4
          break;
        case '4x2':
          this.boardSize = 'medium'; // Assuming 'medium' is for 4x2
          break;
        case '2x2':
          this.boardSize = 'small'; // Assuming 'small' is for 2x2
          break;
        default:
          this.boardSize = 'large'; // Default size
      }
    }
    
    gameCompleted() {
      console.log('gameover')
      console.log(this.attempts)
      this.#gameBoard.style.display = 'none'
      const resetButton = this.shadowRoot.getElementById('resetButton');
  if (resetButton) {
    resetButton.style.display = 'inline-block'
  }

  const gameIsCompleted = document.createElement('game-completed')
  this.shadowRoot.append(gameIsCompleted)

  

    }

    /* startGame() {
      const welcomePage = this.shadowRoot.getElementById('welcomePage');
      const gameBoard = this.shadowRoot.getElementById('game-board');
      
      if (welcomePage) {
        welcomePage.style.display = 'none'
      }
    
      if (gameBoard) {
        gameBoard.style.display = 'grid'
      }
    
      
    } */











  }
)