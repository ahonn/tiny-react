import React, { Component } from './tiny-react'
// import React, { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props)
    console.log(this)
    this.state = {
      val: 0
    }
  }

  render() {
    return (
      <div>
        <span>{this.state.val}</span>
      </div>
    )
  }
}

export default App
