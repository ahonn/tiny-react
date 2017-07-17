import ReactDOM from './dom'
import ReactElement from './element'
import { ReactClassComponent } from './component'

const render = ReactDOM.render
const createElement = ReactElement.createElement

const React = {
  render,
  createElement,
  Component: ReactClassComponent,
}

if (window) {
  window['React'] = React
}

export default React
