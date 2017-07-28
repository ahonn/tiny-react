const dirtyComponents = []
let updateBatchNumber = 0

export const updater = {
  enqueueSetState: function (instance, partialState) {
    const internalInstance = instance._reactInternalInstance

    if (!internalInstance) return
    const queue = internalInstance._pendingStateQueue ||
      (internalInstance._pendingStateQueue = [])

    queue.push(partialState)
    enqueueUpdate(internalInstance)
  },
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
      component.updateComponent()
    }
  }
}

function enqueueUpdate(component) {
  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component)
    return
  }

  dirtyComponents.push(component)
  if (component._updateBatchNumber === null) {
    component._updateBatchNumber = updateBatchNumber + 1
  }
}


