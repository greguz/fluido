import pipeline from 'pump'

import { isFunction, last } from './internal/utils'

export function pump (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      pump(...args, err => (err ? reject(err) : resolve()))
    )
  }

  const callback = last(args)
  if (args.length < 3) {
    callback(new Error('Expected at least two streams to pipe'))
    return
  }

  pipeline(...args)
}
