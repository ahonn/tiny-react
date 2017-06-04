export class VElement {
  constructor(type, props, key, ref) {
    this.type = type
    this.props = props
    this.key = key
    this.ref = ref
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

    let children = ''
    if (props.children) {
      // TODO: render children
      // children = this._mountChildren(props.children)
    }
    ret += children
    ret += `</${this._tag}>`
    return ret
  }
}
