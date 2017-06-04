import { instantiateVComponent } from './virtual-dom'

export function render(element, container) {
  const domID = 0
  const mainComponent = instantiateVComponent(element)
  const containerContent = mainComponent.mountComponent(domID)

  container.innerHTML = containerContent
}
