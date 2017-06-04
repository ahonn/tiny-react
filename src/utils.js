export function extend(obj, props) {
  for (let propsName in props) {
    obj[propsName] = props[propsName]
  }
  return obj
}

