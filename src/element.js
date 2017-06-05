import { Element } from './virtual-dom'

const RESERVED_PROPS = {
  ref: true,
  key: true,
  __self: true,
  __source: true,
}

export function createElement(type, config, ...children) {
  let props = {}
  let key = null
  let ref = null

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref
    key = config.key === undefined ? null : '' + config.key

    for (let propsName in config) {
      if (RESERVED_PROPS.hasOwnProperty(propsName)) {
        continue
      }

      if (config.hasOwnProperty(propsName)) {
        props[propsName] = config[propsName]
      }
    }

    props.children = children
  }

  if (type && type.defaultProps) {
    let defaultProps = type.defaultProps
    for (let propsName in defaultProps) {
      if (props[propsName] === undefined) {
        props[propsName] = defaultProps[propsName]
      }
    }
  }

  return new Element(type, props, key, ref)
}
