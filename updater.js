const dirtyComponents = []

const batchingStrategy = {
  isBatchingUpdates: false,

  batchedUpdates: function (callback, component) {
    const alreadyBatchingUpdates = this.isBatchingUpdates
    this.isBatchingUpdates = true

    if (alreadyBatchingUpdates) {
      callback(component)
    }
  }
}

function enqueueUpdate(component) {
  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component)
    return
  }
  dirtyComponents.push(component)
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
    enqueueUpdate(this.instance)
  }

}

