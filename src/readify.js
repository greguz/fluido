import { writable } from './writable'
import { readable } from './readable'
import { pump } from './pump'

import destroyStream from './internal/destroy'

export function readify (streams, options) {
  if (streams.length <= 0) {
    return readable(options)
  } else if (streams.length === 1) {
    return streams[0]
  }

  let collector

  let next

  return readable({
    ...options,
    read () {
      if (collector) {
        if (next) {
          const callback = next
          next = undefined
          callback()
        }
        return
      }

      collector = writable({
        objectMode: true,
        write: (chunk, encoding, callback) => {
          if (this.push(chunk)) {
            callback()
          } else {
            next = callback
          }
        }
      })

      pump(...streams, collector, err => {
        if (err) {
          this.emit('error', err)
        } else {
          this.push(null)
        }
      })
    },
    destroy (err, callback) {
      callback(destroyStream(collector, err))
    }
  })
}
