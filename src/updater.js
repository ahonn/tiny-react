const dirtyComponents = []

export const Updater = {
  enqueueSetState: function (instance, partialState) {
    const queue = instance._pendingStateQueue ||
      (instance._pendingStateQueue = [])
    queue.push(partialState)
    enqueueUpdate(instance)
  }
}

const batchingStrategy = {
  isBatchingUpdates: false,

  batchedUpdates: function (callback, component) {
    const alreadyBatchingUpdates = this.isBatchingUpdates
    this.isBatchingUpdates = true

    if (alreadyBatchingUpdates) {
      callback(component)
    } else {
      this.runBatchUpdates()
    }
  },

  runBatchUpdates: function () {
    const len = dirtyComponents.length
    for (let i = 0; i < len; i++) {
      const component = dirtyComponents[i]
      component._updateComponent()
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


