const template = document.createElement('template')
template.innerHTML = `
  <style>
    .highlighted {
      color: yellow;
    }
    h1 {
      margin-top: 100px;
      margin-bottom: 50px;
      font-size: 60px;
      display: flex;
    }

    h2 {
      font-weight: bold;
      margin-bottom: 30px;
    }

    p {
      font-size: 25px;
      font-weight: bold;
      text-align: center;
    }

    #top {
      color: yellow;
    }

    #top5 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      border-style: inset;
    }

    #top5message {
      color: yellow;
    }
  </style>
  <div>
    <div id="top">
      <h1></h1>
      <p></p>
    </div>
    <div id="top5">
      <h2>Top5 Scores</h2>
    </div>
  </div>
`


customElements.define('game-completed',

class extends HTMLElement {


    constructor () {
        super()
        this.render()
        this.attachShadow({ mode: 'open' })
    }


connectedCallback () {



    this.render() 

}



render () {
console.log('Game Is completed')

}







}


)