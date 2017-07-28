import { instantiateReactComponent } from '.'

export class ReactDOMEmptyComponent {
  constructor() {
    this._currentElement = null
    this._hostNode = null
    this._hostParent = null
    this._hostContainerInfo = null
    this._domId = 0
  }

  mountComponent(hostParent, hostContainerInfo, context) {
    this._context = context
    this._hostParent = hostParent
    this._hostContainerInfo = hostContainerInfo
    this._domId = hostContainerInfo._idCounter++

    return ''
  }
}

export class ReactDOMTextComponent {
  constructor(text) {
    this._currentElement = text
    this._stringText = '' + text
    this._hostNode = null
    this._hostParent = null

    this.domID = 0
    this._mountIndex = 0
  }

  mountComponent(hostParent, hostContainerInfo) {
    const domID = hostContainerInfo._idCounter++

    this._domID = domID
    this._hostParent = hostParent

    const openingValue = '<!-- react-text: ' + domID + ' -->'
    const closingValue = '<!-- /reatc-text -->'
    return openingValue + this._stringText + closingValue
  }
}

let globalIdCounter = 1

export class ReactDomComponent {
  constructor(element) {
    let tag = element.type

    this._currentElement = element
    this._tag = tag.toLowerCase()
    this._domID = 0
    this._rootNodeID = 0
    this._hostParent = null
    this._hostContainerInfo = null
    this._renderedChildren = null
  }

  _mountChildren(props, context) {
    let innerHTML = props.dangerouslySetInnerHTML
    if (innerHTML == null) {
      innerHTML = ''
      this._renderedChildren = []
      const children = props.children
      for (let index in children) {
        const child = children[index]
        const childrenComponent = instantiateReactComponent(child)
        this._renderedChildren.push(childrenComponent)
        innerHTML += childrenComponent.mountComponent(this._hostParent, this._hostContainerInfo, context)
      }
    }

    return innerHTML
  }

  mountComponent(hostParent, hostContainerInfo, context) {
    this._hostParent = hostParent
    this._hostContainerInfo = hostContainerInfo
    this._domID = hostContainerInfo._idCounter++
    this._rootNodeID = globalIdCounter++

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
      tagContent = this._mountChildren(props, context)
    }
    ret += tagContent
    ret += `</${this._tag}>`
    return ret
  }
}

