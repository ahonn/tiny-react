import { updater } from './updater'

export class ReactClassComponent {
  constructor(props, context) {
    this.props = props
    this.context = context
    this.state = this.state || {}
    this.updater = updater
  }
}

ReactClassComponent.prototype.setState = function (partialState, callback) {
  if (typeof partialState !== 'object' && typeof partialState !== 'function') {
    throw new Error('setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.')
  }
  this.updater.enqueueSetState(this, partialState)
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState')
  }
}



