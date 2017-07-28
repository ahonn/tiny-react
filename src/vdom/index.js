import {
  ReactDomComponent,
  ReactDOMTextComponent,
  ReactDOMEmptyComponent,
} from './host'
import { ReactCompositeComponent } from './composite'

export function instantiateReactComponent(element) {
  let instance = null
  if (element === null || element === false) {
    instance = new ReactDOMEmptyComponent()
  }

  if (typeof element === 'string' || typeof element === 'number') {
    instance = new ReactDOMTextComponent(element)
  }

  if (typeof element === 'object') {
    let type = element.type
    if (typeof type === 'string') {
      instance = new ReactDomComponent(element)
    } else if (typeof type === 'function') {
      instance = new ReactCompositeComponent(element)
    }
  }
  return instance
}
