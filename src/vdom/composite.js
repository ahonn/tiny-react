import { instantiateReactComponent } from '.'

export class ReactCompositeComponent {
  constructor(element) {
    this._currentElement = element
    this._rootNodeId = 0
    this._instance = null
    this._hostParent = null
    this._hostContainerInfo = null
    this._context = null

    this._renderedComponent = null
    this._updateBatchNumber = null
    this._pendingStateQueue = null
    this._pendingCallbacks = null
  }

  mountComponent(hostParent, hostContainerInfo, context) {
    this._context = context
    this._hostParent = hostParent
    this._hostContainerInfo = hostContainerInfo

    const Component = this._currentElement.type
    const publicProps = this._currentElement.props
    const publicContext = this._processContext(context)
    const ins = new Component(publicProps, publicContext)

    ins.props = publicProps
    ins.context = publicContext
    ins.refs = {}

    this._instance = ins
    ins._reactInternalInstance = this

    let initialState = ins.state
    if (initialState === undefined) {
      ins.state = initialState = null
    }

    const markup = this._initialMount(hostParent, hostContainerInfo, context)
    return markup
  }

  updateComponent() {
  }

  _initialMount(hostParent, hostContainerInfo, context) {
    const ins = this._instance

    if (ins.componentWillMount) {
      ins.componentWillMount()

      if (this._pendingStateQueue) {
        ins.state = this._processPendingState(ins.props, ins.context)
      }
    }

    const renderedElement = ins.render()
    const renderedComponent = instantiateReactComponent(renderedElement)

    this._renderedComponent = renderedComponent
    const childContext = this._processChildContext(context)
    const markup = renderedComponent.mountComponent(hostParent, hostContainerInfo, childContext)

    return markup
  }

  _processPendingState() {
    const ins = this._instance
    const queue = this._pendingStateQueue
    this._pendingStateQueue = null

    if (!queue) {
      return ins.state
    }

    const nextState = ins.state
    for (let i = 0; i < queue.length; i++) {
      const partial = queue[i]
      Object.assign(nextState, partial)
    }

    return nextState
  }

  _processContext(context) {
    const Component = this._currentElement.type
    const contextTypes = Component.contextTypes
    if (!contextTypes) {
      return {}
    }
    const maskedContext = {}
    for (let name in contextTypes) {
      maskedContext[name] = context[name]
    }
    return maskedContext
  }

  _processChildContext(currentContext) {
    const ins = this._instance
    let childContext = null

    if (ins.getChildContext) {
      childContext = ins.getChildContext()
    }
    if (childContext) {
      return Object.assign({}, currentContext, childContext)
    }
    return currentContext
  }
}
