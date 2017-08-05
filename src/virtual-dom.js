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

  mountComponent() {
    return this._stringText
  }
}

class ReactDomComponent {
  constructor(element) {
    let tag = element.type

    this._element = element
    this._tag = tag.toLowerCase()
  }

  _mountChildren(children) {
    let result = ''
    for (let index in children) {
      const child = children[index]
      const childrenComponent = instantiateReactComponent(child)
      result += childrenComponent.mountComponent()
    }
    return result
  }

  mountComponent() {
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
  }

  mountComponent() {
    const Component = this._element.type
    const props = this._element.props
    const instance = new Component(props)

    const renderedElement = instance.render()
    const renderedComponent = instantiateReactComponent(renderedElement)
    const renderedResult = renderedComponent.mountComponent()
    return renderedResult
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
