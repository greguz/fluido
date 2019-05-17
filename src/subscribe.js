import { pipeline } from 'stream'

import { finished } from './finished'
import { isReadable, isDuplex } from './is'

import { isFunction, last } from './internal/utils'

export function subscribe (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      subscribe(...args, (err, result) => (err ? reject(err) : resolve(result)))
    )
  }

  const callback = args.pop()

  if (args.length <= 0) {
    return callback(new Error('Expected at least one stream'))
  }
  for (let i = 0; i < args.length; i++) {
    if (i === 0) {
      if (!isReadable(args[i])) {
        return callback(new TypeError('Expected readable stream'))
      }
    } else {
      if (!isDuplex(args[i])) {
        return callback(new TypeError('Expected duplex stream'))
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
