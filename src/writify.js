import { pump } from './pump'
import { writable } from './writable'

import destroyStream from './internal/destroy'

export function writify (streams, options) {
  if (streams.length <= 0) {
    return writable(options)
  } else if (streams.length === 1) {
    return streams[0]
  }

  // First writable stream in pipeline
  let target

  // Current write/final callback
  let next

  // Current pipeline error
  let error

  // Update error and fire next if necessary
  function call (err) {
    error = err || error
    if (next) {
      const callback = next
      next = undefined
      callback(error)
    }
  }

  return writable({
    ...options,
    write (chunk, encoding, callback) {
      // Initialize the pipeline
      if (!target) {
        target = streams[0]
        pump(...streams, call)
      }

      // Handle possible pipeline error
      if (error) {
        callback(error)
        return
      }

      // Perform write and handle backpressure
      if (!target.write(chunk, encoding)) {
        next = callback
        target.once('drain', call)
      } else {
        callback()
      }
    },
    final (callback) {
      next = callback
      target.end()
    },
    destroy (err, callback) {
      callback(destroyStream(target, err))
    }
  })
}
