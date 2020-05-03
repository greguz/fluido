import { Writable, pipeline } from 'readable-stream'

import { isFunction, last } from './internal/util'

export function subscribe (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      subscribe(...args, (err, result) => (err ? reject(err) : resolve(result)))
    )
  }
  const end = args.pop()
  let result
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
