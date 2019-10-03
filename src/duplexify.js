import { duplex } from './duplex'
import { finished } from './finished'

import destroyStream from './internal/destroy'

export function duplexify (readable, writable, options) {
  let reading = false

  function read () {
    if (reading) {
      readable.resume()
      return
    }

    reading = true

    const listener = data => {
      if (!this.push(data)) {
        readable.pause()
      }
    }

    finished(readable, err => {
      readable.removeListener('data', listener)

      if (err) {
        this.emit('error', err)
      } else {
        this.push(null)
      }
    })

    readable.addListener('data', listener)
  }

  function write (chunk, encoding, callback) {
    writable.write(chunk, encoding, callback)
  }

  function final (callback) {
    writable.end(callback)
  }

  function destroy (err, callback) {
    if (readable) {
      err = destroyStream(readable, err)
    }
    if (writable) {
      err = destroyStream(writable, err)
    }
    callback(err)
  }

  return duplex({
    ...options,
    read: readable ? read : undefined,
    write: writable ? write : undefined,
    writev: undefined,
    final: writable ? final : undefined,
    destroy
  })
}
