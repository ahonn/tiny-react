import { createElement } from './element'
import { Component } from './component'
import { render } from './dom'

const React = {
  createElement,
  Component,
  render
}
if (window) {
  window['React'] = React
}

export default React
