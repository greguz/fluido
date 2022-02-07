import { Duplex, finished } from 'readable-stream'

import { destroyStream } from './lib/destroy.mjs'
import { isPlainObject } from './lib/util.mjs'

function noSource () {
  this.push(null)
}

function noTarget (chunk, encoding, callback) {
  callback(null)
}

export function duplexify (options, readable, writable) {
  if (!isPlainObject(options)) {
    writable = readable
    readable = options
    options = {}
  }

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
        this.destroy(err)
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
    readableHighWaterMark: readable ? readable.readableHighWaterMark : undefined,
    readableObjectMode: readable ? readable.readableObjectMode : undefined,
    writableHighWaterMark: writable ? writable.writableHighWaterMark : undefined,
    writableObjectMode: writable ? writable.writableObjectMode : undefined,
    ...options,
    read: readable ? read : noSource,
    write: writable ? write : noTarget,
    writev: undefined,
    final: writable ? final : undefined,
    destroy
  })
}
