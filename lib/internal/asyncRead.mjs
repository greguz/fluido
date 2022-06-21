import { isPromiseLike } from './promise.mjs'
import { once } from './util.mjs'

export function createReadMethod (asyncRead) {
  let reading = false

  return function _read (size) {
    if (reading) {
      return
    }
    reading = true

    const callback = once((err, data) => {
      if (err) {
        process.nextTick(() => this.emit('error', err))
        return
      }

      if (data !== undefined) {
        this.push(data)
      }

      const state = this._readableState || {}

      if (data === null || !!state.ended) {
        return
      }

      reading = false

      if (state.length < state.highWaterMark) {
        setImmediate(() => this._read(size))
      }
    })

    const out = asyncRead.call(this, size, callback)
    if (isPromiseLike(out)) {
      out.then(
        result => callback(null, result),
        callback
      )
    }
  }
}
