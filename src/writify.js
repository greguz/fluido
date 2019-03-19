import { pipeline } from 'stream'

import { isTransform, isWritable } from './is'
import { first } from './utils'
import { writable } from './writable'

export function writify (streams, options) {
  for (let i = 0; i < streams.length; i++) {
    if (i === streams.length - 1) {
      if (!isWritable(streams[i])) {
        throw new TypeError('The last stream must be a writable stream')
      }
    } else {
      if (!isTransform(streams[i])) {
        throw new TypeError('Other streams must be transform streams')
      }
    }
  }

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
      if (endReached) {
        callback(err)
      } else {
        cbClose = callback
        target.destroy(err)
      }
    }
  })
}
