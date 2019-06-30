import { pipeline } from 'stream'
import { writable } from './writable'
import { first, destroyStream } from './internal/utils'

export function writify (streams, options) {
  if (streams.length <= 0) {
    return writable(options)
  } else if (streams.length === 1) {
    return first(streams)
  }

  let target

  let cbClose

  let endReached
  let endError

  return writable({
    ...options,
    write (chunk, encoding, callback) {
      if (!target) {
        target = first(streams)

        pipeline(...streams, err => {
          endReached = true
          endError = err

          if (cbClose) {
            cbClose(err)
          }
        })
      }

      if (endReached) {
        return callback(endError || new Error('Premature close'))
      }

      if (!target.write(chunk, encoding)) {
        cbClose = callback
        target.once('drain', () => {
          cbClose = undefined
          callback()
        })
      } else {
        callback()
      }
    },
    final (callback) {
      if (endReached) {
        callback(endError)
      } else {
        cbClose = callback
        target.end()
      }
    },
    destroy (err, callback) {
      callback(destroyStream(target, err))
    }
  })
}
