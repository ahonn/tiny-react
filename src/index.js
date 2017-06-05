import { createElement } from './element'
import { Component } from './component'
import { render } from './dom'

const Svar = {
  createElement,
  Component,
  render
}
if (window) {
    window['Svar'] = Svar
}

export default Svar
