import { createElement } from './element'
import { ReactClassComponent } from './component'
import { render } from './dom'

const React = {
  render,
  createElement,
  Component: ReactClassComponent,
}

if (window) {
  window['React'] = React
}

export default React
