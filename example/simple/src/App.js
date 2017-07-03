import React, { Component } from './tiny-react'

class App extends Component {
  constructor(props) {
    super(props)
    console.log('constructor')
    this.state = {
      count: 0
    }
  }

  componentWillMount() {
    console.log('componentWillMount')
    this.setState({
      count: this.state.count + 1
    })
    console.log(this.state.count)
    this.setState({
      count: this.state.count + 1
    })
    console.log(this.state.count)
  }

  render() {
    console.log('render')
    return (
      <div>
        <span>{this.state.count}</span>
      </div>
    )
  }
}

export default App
