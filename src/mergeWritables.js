import { Writable } from 'stream'

import { _handle } from './handle'

import destroyStream from './internal/destroy'

export function mergeWritables (targets, options) {
  // Current write/final callback
  let next

  // Current error
  let error

  // Targets count with backpressure on
  let waiting

  // Update current error and fire next callback if necessary
  function call (err) {
    error = err || error
    if (next) {
      const callback = next
      next = undefined
      callback(error)
    }
  }

  function write (chunk, encoding, callback) {
    next = callback

    // Handle targets error
    if (waiting === undefined) {
      _handle(targets, { readable: false }, call)
      waiting = 0
    }

    // Handle error
    if (error) {
      call(error)
      return
    }

    // Handle targets backpressure
    for (const target of targets) {
      const plugged = !target.write(chunk, encoding)

      if (plugged) {
        waiting++
        target.once('drain', () => {
          waiting--
          if (waiting <= 0) {
            call()
          }
        })
      }
    }
    if (waiting <= 0) {
      call()
    }
  }

  function final (callback) {
    next = callback
    for (const target of targets) {
      target.end()
    }
  }

  function destroy (err, callback) {
    for (const target of targets) {
      err = destroyStream(target, err)
    }
    callback(err)
  }

  return new Writable({
    ...options,
    write,
    writev: undefined,
    final,
    destroy
  })
}
