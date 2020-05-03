import { handlePromise } from './promise'
import { once } from './util'

export function createReadMethod (asyncRead) {
  asyncRead = handlePromise(asyncRead)

  let reading = false
  return function fluidoMethod (size) {
    if (reading) {
      return
    }
    reading = true

    function callback (err, data) {
      if (err) {
        process.nextTick(() => this.emit('error', err))
        return
      }

      if (data !== undefined) {
        this.push(data)
      }

      if (this._readableState.ended) {
        return
      }

      reading = false

      if (this._readableState.length < this._readableState.highWaterMark) {
        setImmediate(() => this._read(size))
      }
    }

    asyncRead.call(this, size, once(callback))
  }
}
