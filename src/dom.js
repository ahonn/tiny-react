import { instantiateReactComponent } from './virtual-dom'

export function render(element, container) {
  const rootID = 0
  const mainComponent = instantiateReactComponent(element)
  const containerContent = mainComponent.mountComponent(rootID)

  container.innerHTML = containerContent
}
