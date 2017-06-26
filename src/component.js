import { Updater } from './updater'

export class ReactClassComponent {
  constructor(props, context) {
    this.props = props
    this.context = context
    this.state = this.state || {}
    this.updater = new Updater(this)
  }

  static setState(partialState, callback) {
    if (typeof partialState !== 'object' || typeof partialState !== 'function') {
      throw new Error('setState(...): takes an object of state variables to update or a ' +
        'function which returns an object of state variables.')
    }
    this.updater.enqueueSetState(partialState)
    if (callback) {
      this.updater.enqueueCallback(callback, 'setState')
    }
  }
}


