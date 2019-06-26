import { Readable } from 'stream'
import { voidRead } from './internal/void'

function wrap (read) {
  let reading = false

  return function wrapped (size) {
    if (reading) {
      return
    }
    reading = true

    read.call(this, size, (err, data) => {
      if (err) {
        process.nextTick(() => this.emit('error', err))
        return
      }

      reading = false

      const ended = this._readableState.ended === true

      const flowing = data === undefined
        ? this.readableFlowing === true
        : this.push(data)

      if (!ended && flowing) {
        this._read(size)
      }
    })
  }
}

export function readable (options = {}) {
  const read = options.read || voidRead

  return new Readable({
    ...options,
    read: read.length >= 2 ? wrap(read) : read
  })
}
