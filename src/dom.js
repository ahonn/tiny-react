import { instantiateSvarComponent } from './virtual-dom'

export function render(element, container) {
  const rootID = 0
  const mainComponent = instantiateSvarComponent(element)
  const containerContent = mainComponent.mountComponent(rootID)

  container.innerHTML = containerContent
}
