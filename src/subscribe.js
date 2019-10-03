import { pump } from './pump'
import { finished } from './finished'

import { isFunction, last } from './internal/utils'

export function subscribe (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      subscribe(...args, (err, result) => (err ? reject(err) : resolve(result)))
    )
  }

  const callback = args.pop()

  if (args.length <= 0) {
    callback(new Error('Expected at least one stream'))
    return
  }

  let value

  const listener = data => (value = data)

  const target = last(args)

  const done = err => {
    target.removeListener('data', listener)
    callback(err, value)
  }

  if (args.length > 1) {
    pump(...args, done)
  } else {
    finished(target, done)
  }

  target.addListener('data', listener)
}
