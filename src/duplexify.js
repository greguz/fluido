import { Duplex, finished } from 'readable-stream'

import { destroyStream } from './internal/destroy'

export function duplexify (readable, writable, options) {
  let listener

  function read () {
    if (listener) {
      readable.resume()
      return
    }

    listener = data => {
      if (!this.push(data)) {
        readable.pause()
      }
    }

    finished(readable, { writable: false }, err => {
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
      destroyStream(readable, err)
    }
    if (writable) {
      destroyStream(writable, err)
    }
    callback(err)
  }

  return new Duplex({
    ...options,
    read: readable ? read : undefined,
    write: writable ? write : undefined,
    writev: undefined,
    final: writable ? final : undefined,
    destroy
  })
}
