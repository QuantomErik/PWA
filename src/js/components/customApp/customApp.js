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
    width: 380px;
    height: 440px;
    margin: 20px;
    /* background-color: #f9f9f9; */
    background: linear-gradient(to right, #b0bbe7 0%, #1f2e5c 100%);
    text-align: center;
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

</style>

<div id="Window">
  <div id="dragHandle">
  <button id="exitButton">&times;</button>
  </div>
   <!-- <button id="exitButton">&times;</button> -->
   <button id="findMcDonalds">Find nearby McDonalds</button>
   <div id="locationsContainer"></div>
   
   
  
  </div>



`

customElements.define('custom-app',

class extends HTMLElement {

constructor () {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.findMcDonaldsButton = this.shadowRoot.querySelector('#findMcDonalds')
        this.locationsContainer = this.shadowRoot.querySelector('#locationsContainer')
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
    this.isDragging = false
}

closeMessageApp() {
    this.remove() // Removes the element from the DOM

    
}

connectedCallback () {
    this.shadowRoot.getElementById('exitButton').addEventListener('click', () => this.closeMessageApp())
    window.addEventListener('mousemove', (event) => this.handleDragMove(event))
    window.addEventListener('mouseup', () => this.handleDragEnd())

    const dragHandle = this.shadowRoot.getElementById('dragHandle')
    dragHandle.addEventListener('mousedown', (event) => this.handleDragStart(event))

    this.findMcDonaldsButton.addEventListener('click', () => this.findLocations())
    /* const mcDonaldsButton = this.shadowRoot.getElementById('mcDonalds')
    mcDonaldsButton.addEventListener('click', () => this.findMcDonalds()) */

}
findLocations() {
    console.log('findMcDOnalds function')
    // Example: Open a new window. You can replace this with your specific logic
    
}


})
