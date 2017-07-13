class ReactDOMEmptyComponent {
  constructor() {
    this._element = null
  }

  mountComponent() {
    return ''
  }
}

class ReactDOMTextComponent {
  constructor(text) {
    this._element = text
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

    this._element = element
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
    if (typeof this._element.type !== 'string') {
      throw new Error('DOMComponent\'s Element.type must be string')
    }

    let ret = `<${this._tag} `
    let props = this._element.props
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
    this._element = element
    this._rootId = 0
    this._instance = null

    this._updateBatchNumber = null
    this._pendingStateQueue = null
    this._pendingCallback = null
  }

  mountComponent(rootID) {
    this._rootId = rootID
    if (typeof this._element.type !== 'function') {
      throw new Error('CompositeComponent\'s Element.type must be function')
    }

    const Component = this._element.type
    const props = this._element.props
    const ins = new Component(props)

    ins._reactInternalInstance = this
    this._instance = ins

    let initialState = ins.state
    if (initialState === undefined) {
      initialState = ins.state = null
    }

    const markup = this._initialMount()
    return markup
  }

  updateComponent() {
    console.log('update')
    const ins = this._instance

    if (this._pendingStateQueue) {
      ins.state = this._processPendingState()
    }
  }

  _initialMount() {
    const ins = this._instance

    if (ins.componentWillMount) {
      ins.componentWillMount()

      if (this._pendingStateQueue) {
        ins.state = this._processPendingState()
      }
    }

    const renderedElement = ins.render()
    const renderedComponent = instantiateReactComponent(renderedElement)
    const markup = renderedComponent.mountComponent(this.rootID)

    if (ins.componentDidMount) {
      ins.componentDidMount()

      if (this._pendingStateQueue) {
        ins.state = this._processPendingState()
      }
    }
    ins.updater.resetBatchingStrategy()

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
      console.log(nextState)
    for (let i = 0; i < queue.length; i++) {
      const partial = queue[i]
      console.log(partial)
      Object.assign(nextState, partial)
    }

    return nextState
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
