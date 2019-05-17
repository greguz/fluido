import { pipeline } from 'stream'

import { isWritable, isDuplex } from './is'
import { writable } from './writable'

import { first } from './internal/utils'

export function writify (streams, options) {
  for (let i = 0; i < streams.length; i++) {
    if (i === streams.length - 1) {
      if (!isWritable(streams[i])) {
        throw new TypeError('Expected writable stream')
      }
    } else {
      if (!isDuplex(streams[i])) {
        throw new TypeError('Expected duplex streams')
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
