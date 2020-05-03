import { Readable, Writable, pipeline } from 'readable-stream'

import { last } from './internal/util'

import { isStream } from './is'

function wrapStreams (streams, options) {
  if (streams.length <= 0) {
    return new Readable(options)
  } else if (streams.length === 1) {
    return streams[0]
  }

  let next
  let tail

  return new Readable({
    ...options,
    read () {
      if (next) {
        const callback = next
        next = undefined
        callback()
      }
      if (tail) {
        return
      }

      const self = this

      tail = new Writable({
        highWaterMark: options.highWaterMark || options.readableHighWaterMark,
        objectMode: options.objectMode || options.readableObjectMode,
        write (chunk, encoding, callback) {
          if (self.push(chunk, encoding)) {
            callback()
          } else {
            next = callback
          }
        }
      })

      pipeline(...streams, tail, err => {
        if (err) {
          self.emit('error', err)
        } else {
          self.push(null)
        }
      })
    },
    destroy (err, callback) {
      if (tail) {
        tail.destroy(err, callback)
      } else {
        callback(err)
      }
    }
  })
}

export function readify (...args) {
  return wrapStreams(
    args,
    isStream(last(args)) ? args.pop() : {}
  )
}
