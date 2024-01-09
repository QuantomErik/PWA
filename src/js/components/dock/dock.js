/**
 * The dock web component.
 *
 * @author // Erik Yang <ey222ci@student.lnu.se>
 * @version 1.0.0
 */

const IMG_MEMORY = (new URL('images/memory-game.png', import.meta.url)).href
const IMG_CHAT = (new URL('images/chat-box.png', import.meta.url)).href
const IMG_WEATHER = (new URL('images/weather-app.png', import.meta.url)).href

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
   #app-dock {
     display: flex;
     flex-direction: column;
     justify-content: start;
     align-items: center;
     position: fixed;
     right: 0;
     top: 50%;
     transform: translateY(-50%);
     padding: 10px 0;
 }
 .app-icon {
     margin: 0 10px;
     margin-bottom: 10px;
     cursor: pointer;
     width: 50px;
     height: 50px;
     border-radius: 10px;
 }

 .loading-indicator {
     display: none;
     border: 5px solid #f3f3f3;
     border-top: 5px solid #3498db;
     border-radius: 50%;
     width: 50px;
     height: 50px;
     animation: spin 2s linear infinite;
 }

 @keyframes spin {
     0% {
         transform: rotate(0deg);
     }
     100% {
         transform: rotate(360deg);
     }
 }

</style>
<div class="loading-indicator"></div>
<div id="app-dock">
   <img id="memoryGameIcon" src="${IMG_MEMORY}" class="app-icon" tabindex="0" alt="Memory Game">
   <img id="messagesAppIcon" src="${IMG_CHAT}" class="app-icon" tabindex="0" alt="Messages App">
   <img id="customAppIcon" src="${IMG_WEATHER}" class="app-icon" tabindex="0" alt="Weather App">
</div>
`
/*
 * Define custom element.
 */
window.customElements.define('app-dock',

  /**
   * Represents a dock for launching different applications such as Memory Game, Messages App, and Weather App.
   */
  class extends HTMLElement {
    /**
     * Private collection of icon elements in the dock.
     *
     * @type {Element[]}
     */
    #icons

    /**
     * Private collection of icon elements in the dock.
     *
     * @type {number}
     */
    #loadingTimeout
    /**
     * Private handle for managing the loading timeout.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.#icons = this.shadowRoot.querySelectorAll('.app-icon')
      this.#loadingTimeout = null
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.shadowRoot.getElementById('app-dock').addEventListener('click', (event) => {
        this.#handleIconClick(event)
      })

      this.#icons.forEach(icon => {
        icon.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            this.#handleIconClick(event)
          } else {
            this.handleArrowKeyPress(event, this.#icons)
          }
        })
      })
    }

    /**
     * Handles click events on the app icons.
     *
     * @param {Event} event - The event object associated with the click.
     * @private
     */
    #handleIconClick (event) {
      const clickedElement = event.target

      // Check if the clicked element or its parent is an app icon
      if (clickedElement.id === 'memoryGameIcon' || clickedElement.closest('#memoryGameIcon')) {
        this.openApp('memoryGame')
      } else if (clickedElement.id === 'messagesAppIcon' || clickedElement.closest('#messagesAppIcon')) {
        this.openApp('messagesApp')
      } else if (clickedElement.id === 'customAppIcon' || clickedElement.closest('#customAppIcon')) {
        this.openApp('customApp')
      }
    }

    /**
     * Opens a specified application.
     *
     * @param {string} appName - The name of the application to open.
     */
    openApp (appName) {
      let loadingTimeout

      this.appLoaded = false
      this.#showLoadingIndicatorAfterDelay()

      switch (appName) {
        case 'messagesApp':

          import('../messageApp/index.js').then(module => {
            this.appLoaded = true
            clearTimeout(loadingTimeout)
            this.#hideLoadingIndicator()
            this.dispatchEvent(new CustomEvent('start-message-app', { bubbles: true }))
          }).catch(err => {
            console.error('Failed to load the Message App', err)
            clearTimeout(loadingTimeout)
            this.#hideLoadingIndicator()
          })
          break

        case 'memoryGame':
          import('../memoryGame/index.js').then(module => {
            this.appLoaded = true
            clearTimeout(loadingTimeout)
            this.#hideLoadingIndicator()
            this.dispatchEvent(new CustomEvent('start-memory-game', { bubbles: true }))
          }).catch(err => {
            console.error('Failed to load the Memory Game', err)
            clearTimeout(loadingTimeout)
            this.#hideLoadingIndicator()
          })
          break

        case 'customApp':
          import('../customApp/index.js').then(module => {
            this.appLoaded = true
            clearTimeout(loadingTimeout)
            this.#hideLoadingIndicator()
            this.dispatchEvent(new CustomEvent('start-custom-app', { bubbles: true }))
          }).catch(err => {
            console.error('Failed to load the Custom App', err)
            clearTimeout(loadingTimeout)
            this.#hideLoadingIndicator()
          })
          break

        default:
          console.error('Unknown app:', appName)
          clearTimeout(loadingTimeout)
          this.hideLoadingIndicator()
      }
    }

    /**
     * Shows the loading indicator after a brief delay.
     *
     * @private
     */
    #showLoadingIndicatorAfterDelay () {
      // Clear any existing timeout
      clearTimeout(this.#loadingTimeout)

      // Set a new timeout
      this.#loadingTimeout = setTimeout(() => {
        if (!this.appLoaded) {
          this.#showLoadingIndicator()
        }
      }, 100) // Delay in milliseconds
    }

    /**
     * Displays the loading indicator.
     *
     * @private
     */
    #showLoadingIndicator () {
      this.shadowRoot.querySelector('.loading-indicator').style.display = 'block'
    }

    /**
     * Hides the loading indicator.
     *
     * @private
     */
    #hideLoadingIndicator () {
      this.shadowRoot.querySelector('.loading-indicator').style.display = 'none'
    }

    /**
     * Handles keyboard navigation using arrow keys within the dock icons.
     *
     * @param {KeyboardEvent} event - The keyboard event object.
     * @type  {Element[]} icons - A collection of icon elements to navigate through.
     */
    handleArrowKeyPress (event, icons) {
      const currentIndex = Array.from(icons).indexOf(event.target)
      let newIndex = currentIndex
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          // Move focus to the previous icon
          newIndex = currentIndex > 0 ? currentIndex - 1 : icons.length - 1
          break
        case 'ArrowDown':
        case 'ArrowRight':
          // Move focus to the next icon
          newIndex = currentIndex < icons.length - 1 ? currentIndex + 1 : 0
          break
      }

      icons[newIndex].focus()
    }
  }

)
