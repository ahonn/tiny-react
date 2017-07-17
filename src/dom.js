import { instantiateReactComponent } from './virtual-dom'

const ReactDOM = {
  render: function (nextElement, container, callback) {
    const componentInstance = instantiateReactComponent(nextElement)
    const markup = componentInstance.mountComponent()

    container.innerHTML = markup

    if (callback) {
      callback.call(componentInstance)
    }
  },
}

export default ReactDOM
