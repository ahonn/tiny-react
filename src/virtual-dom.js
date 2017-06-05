
class VEmptyComponent {
  constructor() {
    this._element = null
  }

  mountComponent() {
    return ''
  }
}

class VTextComponent {
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

class VDomComponent {
  constructor(element) {
    let tag = element.type

    this._element = element
    this._tag = tag.toLowerCase()
    this._rootID = 0
  }

  mountComponent(rootID) {
    this._rootID = rootID
    if (typeof this._element.type !== 'string') {
      throw new Error('VDOMComponent\'s VElement.type must be string')
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

    let tagContent = ''
    if (props.children) {
      // TODO: render children
      // children = this._mountChildren(props.children)
    }
    ret += tagContent
    ret += `</${this._tag}>`
    return ret
  }
}

class VCompositeComponent {
  constructor(element) {
    this._element = element
    this._rootId = 0
  }

  mountComponent(rootID) {
    this._rootId = rootID
    if (typeof this._element.type !== 'function') {
      throw new Error('VCompositeComponent\'s VElement.type must be function')
    }

    const Component = this._element.type
    const props = this._element.props
    const instance = new Component(props)

    const renderedElement = instance.render()
    const renderedComponent = instantiateVComponent(renderedElement)
    const renderedResult = renderedComponent.mountComponent(rootID)
    return renderedResult
  }
}

export class VElement {
  constructor(type, props, key, ref) {
    this.type = type
    this.props = props
    this.key = key
    this.ref = ref
    console.log(props)
  }
}

export function instantiateVComponent(element) {
  let instance = null
  if (element === null || element === false) {
    instance = new VEmptyComponent()
  }
  
  if (typeof element === 'object') {
    let type = element.type
    if (typeof type === 'string') {
      instance = new VDomComponent(element)
    } else {
      instance = new VCompositeComponent(element)
    }
  } else if (typeof element === 'string' || typeof element === 'number') {
    instance = new VTextComponent(element)
  }
  return instance
}
