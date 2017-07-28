import React, { Component } from './tiny-react'
// import React, { Component } from 'react'

class Hello extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <span>Hello</span>
      </div>
    )
  }
}

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
        <Hello />
      </div>
    )
  }
}

export default App
