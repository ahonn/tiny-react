class ReactDOMEmptyComponent {
  constructor() {
    this._currentElement = null
  }

  mountComponent() {
    return ''
  }
}

class ReactDOMTextComponent {
  constructor(text) {
    this._currentElement = text
    this._stringText = '' + text
    this._rootID = 0
  }

  mountComponent(rootID) {
    this._rootID = rootID
    return this._stringText
  }
}

class ReactDomComponent {
  constructor(element) {
    let tag = element.type

    this._currentElement = element
    this._tag = tag.toLowerCase()
    this._rootID = 0
  }

  _mountChildren(children) {
    let result = ''
    for (let index in children) {
      const child = children[index]
      const childrenComponent = instantiateReactComponent(child)
      result += childrenComponent.mountComponent(index)
    }
    return result
  }

  mountComponent(rootID) {
    this._rootID = rootID
    if (typeof this._currentElement.type !== 'string') {
      throw new Error('DOMComponent\'s Element.type must be string')
    }

    let ret = `<${this._tag} `
    let props = this._currentElement.props
    for (var propsName in props) {
      if (propsName === 'children') {
        continue
      }
      let propsValue = props[propsName]
      ret += `${propsName}=${propsValue}`
    }
    ret += '>'

    let tagContent = ''
    if (props.children) {
      tagContent = this._mountChildren(props.children)
    }
    ret += tagContent
    ret += `</${this._tag}>`
    return ret
  }
}

class ReactCompositeComponent {
  constructor(element) {
    this._currentElement = element
    this._rootNodeId = 0
    this._instance = null
    this._hostParent = null
    this._context = null

    this._renderedComponent = null
    this._updateBatchNumber = null
    this._pendingStateQueue = null
    this._pendingCallbacks = null
  }

  mountComponent(hostParent, context) {
    this._context = context
    this._hostParent = hostParent

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

    const markup = this._initialMount(hostParent, context)
    return markup
  }

  updateComponent() {
  }

  _initialMount(hostParent, context) {
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
    const markup = renderedComponent.mountComponent(hostParent, this._processChildContext(context))

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

export function instantiateReactComponent(element) {
  let instance = null
  if (element === null || element === false) {
    instance = new ReactDOMEmptyComponent()
  }

  if (typeof element === 'string' || typeof element === 'number') {
    instance = new ReactDOMTextComponent(element)
  }

  if (typeof element === 'object') {
    let type = element.type
    if (typeof type === 'string') {
      instance = new ReactDomComponent(element)
    } else if (typeof type === 'function') {
      instance = new ReactCompositeComponent(element)
    }
  }
  return instance
}
