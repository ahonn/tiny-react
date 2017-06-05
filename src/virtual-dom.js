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
    let openingComment = `<!-- text: ${rootID} -->`
    let closingComment = '<!-- /text -->'
    return openingComment + this._stringText + closingComment
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
      if (props.children.length === 1 && 
          typeof props.children[0] === 'string') {
        tagContent += props.children[0]
      } else {
        tagContent = this._mountChildren(props.children)
      }
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

  mountComponent(rootID) {
    this._rootId = rootID
    if (typeof this._element.type !== 'function') {
      throw new Error('CompositeComponent\'s Element.type must be function')
    }

    const Component = this._element.type
    const props = this._element.props
    const instance = new Component(props)

    const renderedElement = instance.render()
    const renderedComponent = instantiateReactComponent(renderedElement)
    const renderedResult = renderedComponent.mountComponent(rootID)
    return renderedResult
  }
}

export function instantiateReactComponent(element) {
  let instance = null
  if (element === null || element === false) {
    instance = new ReactDOMEmptyComponent()
  }
  
  if (typeof element === 'object') {
    let type = element.type
    if (typeof type === 'string') {
      instance = new ReactDomComponent(element)
    } else {
      instance = new ReactCompositeComponent(element)
    }
  } else if (typeof element === 'string' || typeof element === 'number') {
    instance = new ReactDOMTextComponent(element)
  }
  return instance
}
