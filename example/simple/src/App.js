import React, { Component } from './tiny-react'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 1
    }
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return (
      <div>
        <span>{this.state.count}</span>
      </div>
    )
  }
}

export default App
