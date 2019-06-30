import { Duplex } from 'stream'
import { finished } from './finished'
import { voidRead, voidWrite } from './internal/void'
import { destroyStream } from './internal/utils'

export function duplexify (readable, writable, options) {
  function read () {
    if (readable.readableFlowing === null) {
      const listener = data => {
        if (!this.push(data)) {
          readable.pause()
        }
      }
      readable.on('data', listener)

      finished(readable, err => {
        readable.off('data', listener)

        if (err) {
          this.emit('error', err)
        } else {
          this.push(null)
        }
      })
    } else {
      readable.resume()
    }
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
