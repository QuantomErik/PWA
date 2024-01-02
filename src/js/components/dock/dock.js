/* import '../messageApp/index.js' */
const IMG_MEMORY = (new URL('images/memory-game.png', import.meta.url)).href
const IMG_CHAT = (new URL('images/chat-box.png', import.meta.url)).href
const IMG_WEATHER = (new URL('images/weather-app.png', import.meta.url)).href

const template = document.createElement('template')

/* const imageUrl = './images/aurora.jpg' */

/* background-image: url('${imageUrl}');  */

template.innerHTML = `
<style>
  #app-dock {
    display: flex;
    flex-direction: column; 
    justify-content: start;
    align-items: center;
    position: fixed;
    right: 0; /* Position to the right */
    top: 50%; /* Center vertically */
    transform: translateY(-50%); /* Adjust for exact centering */
    /* bottom: 0; */
    /* width: 100%; */
    /* background-color: #333; */
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
    border: 5px solid #f3f3f3; /* Light grey */
    border-top: 5px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
    }

    @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

</style>

<div class="loading-indicator"></div>
<div id="app-dock">
  <img id="memoryGameIcon" src="${IMG_MEMORY}" class="app-icon">
  <img id="messagesAppIcon" src="${IMG_CHAT}" class="app-icon">
  <img id="customAppIcon" src="${IMG_WEATHER}" class="app-icon">

  
</div>
`



window.customElements.define('app-dock',

  /**
   *
   */
  class extends HTMLElement {
    /**
     *
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    /**
     *
     */
    connectedCallback () {

      this.shadowRoot.getElementById('app-dock').addEventListener('click', (event) => {
        this.handleIconClick(event)
      })

      /* this.shadowRoot.getElementById('memoryGameIcon').addEventListener('click', () => this.openApp('memoryGame'))
      this.shadowRoot.getElementById('messagesAppIcon').addEventListener('click', () => this.openApp('messagesApp'))
      this.shadowRoot.getElementById('customAppIcon').addEventListener('click', () => this.openApp('customApp')) */
    }

    handleIconClick(event) {
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
     *
     * @param appName
     */

    openApp (appName) {
      console.log(`Opening ${appName}`)

      let loadingTimeout

      const showLoadingIndicatorAfterDelay = () => {
        loadingTimeout = setTimeout(() => {
          if (!this.appLoaded) {
            this.showLoadingIndicator()
          }
        }, 100) // Delay in milliseconds
      }
  
      this.appLoaded = false;
      showLoadingIndicatorAfterDelay()

      /* this.showLoadingIndicator() */

      switch (appName) {
        case 'messagesApp':
         
        import('../messageApp/index.js').then(module => {
          this.appLoaded = true
          clearTimeout(loadingTimeout)
          this.hideLoadingIndicator()
          this.dispatchEvent(new CustomEvent('start-message-app', {bubbles:true}))
        }).catch(err => {
          console.error('Failed to load the Message App', err)
          clearTimeout(loadingTimeout)
          this.hideLoadingIndicator()
        })
        break
       
        
        case 'memoryGame':
          import('../memoryGame/index.js').then(module => {
            this.appLoaded = true
          clearTimeout(loadingTimeout)
          this.hideLoadingIndicator()
            this.dispatchEvent(new CustomEvent('start-memory-game', {bubbles:true}))
            /* this.hideLoadingIndicator() */
          }).catch(err => {
            console.error('Failed to load the Memory Game', err)
            clearTimeout(loadingTimeout)
            this.hideLoadingIndicator()
          })
          break


          case 'customApp':
          import('../customApp/index.js').then(module => {
            this.appLoaded = true
          clearTimeout(loadingTimeout)
          this.hideLoadingIndicator()
            this.dispatchEvent(new CustomEvent('start-custom-app', {bubbles:true}))
            /* this.hideLoadingIndicator() */
          }).catch(err => {
            console.error('Failed to load the Custom App', err)
            clearTimeout(loadingTimeout)
            this.hideLoadingIndicator()
          })
          break

          default:
            console.error('Unknown app:', appName)
            clearTimeout(loadingTimeout)
            this.hideLoadingIndicator()

      }

      
    }

    showLoadingIndicator() {
      this.shadowRoot.querySelector('.loading-indicator').style.display = 'block'
    }

    hideLoadingIndicator() {
      this.shadowRoot.querySelector('.loading-indicator').style.display = 'none'
    }


    /* openApp (appName) {
      console.log(`Opening ${appName}`)

      if (appName === 'messagesApp') {
        this.dispatchEvent(new CustomEvent('start-message-app', {
          bubbles: true

        }))
        
      }

      if (appName === 'memoryGame') {
        this.dispatchEvent(new CustomEvent('start-memory-game', {
          bubbles: true

        }))
      }

      if (appName === 'customApp') {
        this.dispatchEvent(new CustomEvent('start-custom-app', {
          bubbles: true

        }))
      }

    } */
  }

)
