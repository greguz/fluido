import { Duplex } from 'stream'
import { finished } from './finished'
import { read as vRead, write as vWrite } from './internal/void'

function bothFinished (readable, writable, callback) {
  if (!readable && !writable) {
    process.nextTick(callback)
  } else if (!readable || !writable) {
    finished(readable || writable, callback)
  } else {
    finished(readable, rerr => {
      finished(writable, werr => {
        callback(rerr || werr)
      })
    })
  }
}

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
    bothFinished(readable, writable, callback)
    if (readable) {
      readable.destroy(err)
    }
    if (writable) {
      writable.destroy(err)
    }
  }

  return new Duplex({
    ...options,
    read: readable ? read : vRead,
    write: writable ? write : vWrite,
    writev: undefined,
    final: writable ? final : undefined,
    destroy
  })
}
