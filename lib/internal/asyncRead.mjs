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
      reading = false

      // Detects manual .push(null) and .destroy()
      const alive = !this.closed && !this.readableEnded
      if (!alive) {
        return
      }

      if (err) {
        // This will set `closed` to true
        return this.destroy(err)
      }

      if (data !== undefined) {
        // If null, this will set `readableEnded` to true
        this.push(data)
      }

      if (
        data !== null &&
        this.readableFlowing &&
        this.readableLength < this.readableHighWaterMark
      ) {
        // We have room inside the buffer
        process.nextTick(() => this._read(size))
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
