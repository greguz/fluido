import { Duplex, finished } from 'readable-stream'

import { destroyStream } from './internal/destroy'

function noSource () {
  this.push(null)
}

function noTarget (chunk, encoding, callback) {
  callback(null)
}

export function duplexify (readable, writable) {
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
    allowHalfOpen: true,
    readableHighWaterMark: readable.readableHighWaterMark,
    readableObjectMode: readable.readableObjectMode,
    writableHighWaterMark: writable.writableHighWaterMark,
    writableObjectMode: writable.writableObjectMode,
    read: readable ? read : noSource,
    write: writable ? write : noTarget,
    final: writable ? final : undefined,
    destroy
  })
}
