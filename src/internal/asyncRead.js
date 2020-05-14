import { handlePromise } from './promise'
import { once } from './util'

export function createReadMethod (asyncRead) {
  asyncRead = handlePromise(asyncRead)

  let reading = false
  return function _read (size) {
    if (reading) {
      return
    }
    reading = true

    const self = this
    function callback (err, data) {
      if (err) {
        process.nextTick(() => self.emit('error', err))
        return
      }

      if (data !== undefined) {
        self.push(data)
      }

      const state = self._readableState || {}

      if (data === null || !!state.ended) {
        return
      }

      reading = false

      if (state.length < state.highWaterMark) {
        setImmediate(() => self._read(size))
      }
    }

    asyncRead.call(this, size, once(callback))
  }
}
