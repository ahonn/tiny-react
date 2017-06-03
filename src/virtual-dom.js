export function createVNode(type, props, key, ref) {
  let vNode = {
    type,
    props,
    key,
    ref
  }
  return vNode
}
