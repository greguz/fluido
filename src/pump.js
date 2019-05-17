import { pipeline } from 'stream'

import { isReadable, isWritable, isDuplex } from './is'

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

  const head = args[0]
  const body = args.slice(1, args.length - 2)
  const tail = args[args.length - 2]

  if (!isReadable(head)) {
    return callback(new TypeError('Expected readable stream'))
  }
  for (const ts of body) {
    if (!isDuplex(ts)) {
      return callback(new TypeError('Expected duplex stream'))
    }
  }
  if (!isWritable(tail)) {
    return callback(new TypeError('Expected writable stream'))
  }

  if (isDuplex(tail) && tail.readableFlowing === null) {
    tail.resume()
  }

  return pipeline(...args)
}
