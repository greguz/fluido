import { Duplex } from 'stream'

import { finished } from './finished'

import { voidRead, voidWrite } from './internal/void'
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
      readable.off('data', listener)

      if (err) {
        this.emit('error', err)
      } else {
        this.push(null)
      }
    })

    readable.on('data', listener)
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

  return new Duplex({
    ...options,
    read: readable ? read : voidRead,
    write: writable ? write : voidWrite,
    writev: undefined,
    final: writable ? final : undefined,
    destroy
  })
}
