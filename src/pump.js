import { pipeline } from 'stream'

import { isReadable, isTransform, isWritable } from './is'
import { isFunction, last } from './utils'

export function pump(...args) {
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
    return callback(new Error('Expected readable as first stream'))
  }
  for (const ts of body) {
    if (!isTransform(ts)) {
      return callback(new Error('Expected transforms as body streams'))
    }
  }
  if (!isWritable(tail)) {
    return callback(new Error('Expected writable as last stream'))
  }

  if (isTransform(tail) && tail.readableFlowing === null) {
    tail.resume()
  }

  return pipeline(...args)
}
