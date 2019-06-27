import { Duplex } from 'stream'
import { finished } from './finished'
import { voidRead, voidWrite } from './internal/void'

export function duplexify (readable, writable, options) {
  function read () {
    if (readable.readableFlowing === null) {
      readable.on('data', data => {
        if (!this.push(data)) {
          readable.pause()
        }
      })

      finished(readable, err => {
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
      readable.destroy(err)
    }
    if (writable) {
      writable.destroy(err)
    }
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
