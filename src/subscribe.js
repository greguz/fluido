import { pipeline } from 'stream'

import { finished } from './finished'
import { isReadable, isTransform } from './is'
import { isFunction, last } from './utils'

export function subscribe(...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      subscribe(...args, err => (err ? reject(err) : resolve()))
    )
  }

  const callback = args.pop()

  if (args.length <= 0) {
    return callback(new TypeError('Expected at least one stream'))
  }
  for (let i = 0; i < args.length; i++) {
    if (i === 0) {
      if (!isReadable(args[i])) {
        return callback(new TypeError('The first stream must be a readable'))
      }
    } else {
      if (!isTransform(args[i])) {
        return callback(new TypeError('Expected transform stream'))
      }
    }
  }

  let value

  const listener = data => (value = data)

  const target = last(args)

  const done = err => {
    target.removeListener('data', listener)
    callback(err, value)
  }

  if (args.length > 1) {
    pipeline(...args, done)
  } else {
    finished(target, done)
  }

  target.addListener('data', listener)
}
