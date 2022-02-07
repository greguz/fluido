import { Writable, pipeline } from 'readable-stream'
import { fromCallback } from 'universalify'

function subscribeStream (...args) {
  const end = args.pop()
  let result = null
  pipeline(
    ...args,
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        result = chunk
        callback()
      }
    }),
    err => end(err, result)
  )
}

export const subscribe = fromCallback(subscribeStream)
