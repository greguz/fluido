import { Writable, pipeline } from 'readable-stream'

import { destroyStream } from './lib/destroy.mjs'
import { isPlainObject } from './lib/util.mjs'

export function writify (...streams) {
  const options = isPlainObject(streams[0]) ? streams.shift() : {}

  if (streams.length <= 0) {
    return new Writable(options)
  } else if (streams.length === 1) {
    return streams[0]
  }

  let error
  let head
  let next

  function handle (err) {
    error = err || error
    if (next) {
      const callback = next
      next = undefined
      callback(error)
    }
  }

  return new Writable({
    ...options,
    write (chunk, encoding, callback) {
      next = callback

      if (!head) {
        head = streams[0]
        pipeline(...streams, handle)
      }

      if (error) {
        handle(error)
        return
      }

      if (head.write(chunk, encoding)) {
        handle()
      } else {
        head.once('drain', handle)
      }
    },
    final (callback) {
      next = callback

      if (head && !error) {
        head.end()
      } else {
        handle()
      }
    },
    destroy (err, callback) {
      if (head) {
        destroyStream(head)
      }
      callback(err)
    }
  })
}
