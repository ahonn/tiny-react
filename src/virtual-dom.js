export class VElement {
  constructor(type, props, key, ref) {
    this.type = type
    this.props = props
    this.key = key
    this.ref = ref
  }
}

export class VEmptyComponent {
  constructor() {
    this._element = null
  }

  mountComponent() {
    return ''
  }
}

export class VTextComponent {
  constructor(text) {
    this._element = text
    this._stringText = '' + text
    this._domID = 0
  }

  mountComponent(domID) {
    this._domID = domID
    let openingComment = `<!-- text: ${domID} -->`
    let closingComment = '<!-- /text -->'
    return openingComment + this._stringText + closingComment
  }
}

export class VDomComponent {
  constructor(element) {
    let tag = element.type

    this._element = element
    this._tag = tag.toLowerCase()
    this._domID = 0
  }

  mountComponent(domID) {
    this._domID = domID
    let props = this._element.props

    let ret = `<${this._tag} `
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
      // TODO: add VCompositeComponent
      // instance = new VCompositeComponent(element)
    }
  } else if (typeof element === 'string' || typeof element === 'number') {
    instance = new VTextComponent(element)
  }
  return instance
}
