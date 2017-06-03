import { createVNode } from './virtual-dom'

export function createElement(type, config, ...children) {
  let props = {}
  let key = null
  let ref = null

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref
    key = config.key === undefined ? null : '' + config.key

    for (let propsName in config) {
      if (propsName === 'ref' || propsName === 'key') {
        continue
      }

      if (config.hasOwnProperty(propsName)) {
        props[propsName] = config[propsName]
      }
    }

    props.children = children
  }

  // TODO: add defaultProps support

  return createVNode(type, props, key, ref)
}
