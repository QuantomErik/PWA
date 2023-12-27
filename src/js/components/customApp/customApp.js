const IMG_URL = (new URL('images/magnifying-glass.png', import.meta.url)).href
const IMG_URL2 = (new URL('images/position.png', import.meta.url)).href

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
    align-items: center; 
    
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

    #searchInputContainer {
        position: relative; /* Allows absolute positioning inside the container */
    display: flex;
    align-items: center; /* Aligns children vertically in the middle */

    }

    #searchBox {
        flex-grow: 0;
        border: none;
    padding: 0px;
    background: linear-gradient(to right, #5a5b5b 0%, #2a2b2b 100%);
    color: #23b82a;
    font-weight: bold;
    resize: none;
    height: 35px;
    width: 300px;
    border-radius: 8px;
    padding-left: 40px;

    /* text-align: center; */
    /* align-items: center;  */
    /* justify-content: center; */
    }

    #searchButton {
    position: absolute; /* Positions the button over the textarea */
    right: 5px; /* Adjust as needed */
    height: 30px; /* Match the height of the searchBox */
    width: 30px;
    border: none;
    /* background-color: #23b82a; */ /* Or any color you prefer */
    color: white; /* Text color */
    /* border-radius: 8px; */ /* Optional for rounded corners */
    cursor: pointer;
    border: none;
    /* background: none; */
    cursor: pointer;
    /* font-size: 50px; */
    /* Add padding, font-size, etc., as needed */
    background: url("${IMG_URL}") no-repeat center/50%;
    background-size: 60%;
}

/* #searchButton img {
    width: 100%;
    height: auto;
} */

    #searchBox:focus {
    outline: none;
}

#positionIcon {
    position: absolute;
    left: 5px; /* Adjust as needed */
    width: 30px; /* Icon width */
    height: 30px; /* Icon height */
    background: url("${IMG_URL2}") no-repeat center/50%; /* Replace with your icon path */
    background-size: 60%;
    
    /* background-size: contain; */
}

/* #weatherImageContainer {
    height: 50px;
    width: 50px;
} */

#weatherImage {
    height: 200px;
    width: 200px;
}



</style>

<div id="Window">
  <div id="dragHandle">
  <button id="exitButton">&times;</button>
  </div>
   <!-- <button id="exitButton">&times;</button> -->
   <!-- <div id="searchInputContainer"> -->
   <div id="searchInputContainer">
    <span id="positionIcon"></span>
    <input type="text" id="searchBox" placeholder="Search City..." />
   <button id="searchButton">
    <!-- <img src="./images/magnifying-glass.png" alt="search"> -->
   </button>
   </div>
   
   <div id="weatherImageContainer">
    <img id="weatherImage" src="" alt="Weather Image">
</div>

   <div id="weatherInfo">
    <div id="temperature"></div>
    <div id="windSpeed"></div>
    <div id="humidity"></div>
    <div id="weatherState"></div>
</div>
   
  </div>



`

customElements.define('custom-app',

class extends HTMLElement {

constructor () {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.searchButton = this.shadowRoot.querySelector('#searchButton')
        
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



    this.searchButton.addEventListener('click', () => this.fetchWeather())

    /* this.findMcDonaldsButton.addEventListener('click', () => this.findLocations()) */
    /* const mcDonaldsButton = this.shadowRoot.getElementById('mcDonalds')
    mcDonaldsButton.addEventListener('click', () => this.findMcDonalds()) */

}
/* findLocations() {
    console.log('findMcDOnalds function')
    this.fetchLocations(59.3293, 18.0686, 10, 10)
    // Example: Open a new window. You can replace this with your specific logic
} */

async fetchWeather() {

    console.log('fetching weather')

    const APIkey = '6dc4f57a3bc1d883f18bc90fda0a6973'
    const searchBox = this.shadowRoot.getElementById('searchBox')
    const city = searchBox.value

    if (!city) {
        console.error('No city provided.')
        return
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${APIkey}`

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        this.shadowRoot.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`
        this.shadowRoot.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`
        this.shadowRoot.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`
        this.shadowRoot.getElementById('weatherState').textContent = `Weather: ${data.weather[0].main} (${data.weather[0].description})`

        const weatherStateImages = {
            snow: 'js/components/customApp/images/snowing.png',
            clouds: 'js/components/customApp/images/cloud.png',
            mist: 'js/components/customApp/images/rain-drops.png',
            haze: 'js/components/customApp/images/cloudy-day.png',
            clear: 'js/components/customApp/images/sun.png',
            rain: 'js/components/customApp/images/raining.png',
            sunny: 'js/components/customApp/images/sun.png'
        }

        const weatherState = data.weather[0].main.toLowerCase();
    const weatherImageSrc = weatherStateImages[weatherState];
    if (weatherImageSrc) {
        this.shadowRoot.getElementById('weatherImage').src = weatherImageSrc;
        this.shadowRoot.getElementById('weatherImage').alt = `Weather Image - ${weatherState}`;
    } else {
        console.error('No image found for this weather state:', weatherState);
    }

        console.log(data)
    }  catch (error) {
        console.error('Error fetching weather data:', error)
    }

    /* try {
        
        const response = await fetch('https://api.open-meteo.com/v1/metno?latitude=62&longitude=15&hourly=temperature_2m')
        const locations = await response.json()
        console.log(response)

        this.locationsContainer.innerHTML = ''

        
        // Handle locations data
    } catch (error) {
        console.error('Error:', error)
    } */

    
}




})
