const batchingStrategy = {
  isBatchingUpdates: false,

  batchingStrategy: function (callback, component) {
    const alreadyBatchingUpdates = this.isBatchingUpdates
    this.isBatchingUpdates = true

    if (alreadyBatchingUpdates) {
      callback(component)
    }
  }
}

function enqueueUpdate(component) {

}

export class Updater {
  constructor(instance) {
    this.instance = instance
    this._isBatchingUpdates = false
    this._pendingStateQueue = []
    this._pendingCallback = []
  }

  static enqueueSetState(partialState) {
    this._pendingStateQueue.push(partialState)
    this.enqueueUpdate(this.instance)
  }

}

