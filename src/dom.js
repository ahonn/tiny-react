import { instantiateReactComponent } from './vdom'

const ReactDOM = {
  render: function (nextElement, container, callback) {
    const componentInstance = instantiateReactComponent(nextElement)
    const containerInfo = _createContainerInfo(componentInstance, container)
    const markup = componentInstance.mountComponent(null, containerInfo, {})

    container.innerHTML = markup

    if (callback) {
      callback.call(componentInstance)
    }
  },
} 

function _createContainerInfo(topLevelWarapper, node) {
  const info = {
    _topLevelWarapper: topLevelWarapper,
    _idCounter: 1,
    _ownerDocument: node 
      ? node.nodeType === 9 ? node : node.ownerDocument
      : null,
    _node: node,
  }

  return info
}

export default ReactDOM
