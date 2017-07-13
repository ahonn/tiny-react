import React, { Component } from './tiny-react'

class App extends Component {
  constructor(props) {
    super(props)
    console.log('constructor')
    this.state = {
      val: 0
    }
  }

  // componentWillMount() {
    // console.log('componentWillMount')
    // this.setState({
      // val: this.state.val + 1
    // })
    // console.log(this.state.val)
    // this.setState({
      // val: this.state.val + 1
    // })
    // console.log(this.state.val)
  // }

  componentDidMount() {
    console.log('componentDidMount')
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 1 次 log

    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 3 次 log

      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
    console.log('end')
  }

  render() {
    console.log('render')
    return (
      <div>
        <span>{this.state.val}</span>
      </div>
    )
  }
}

export default App
