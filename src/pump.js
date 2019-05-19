import { pipeline } from 'stream'
import { isFunction, last } from './internal/utils'

export function pump (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      pump(...args, err => (err ? reject(err) : resolve()))
    )
  }

  const callback = last(args)

  if (args.length < 3) {
    return callback(new Error('Expected at least two streams to pipe'))
  }

  const tail = args[args.length - 2]
  if (tail.readableFlowing === null) {
    tail.resume()
  }

  return pipeline(...args)
}
