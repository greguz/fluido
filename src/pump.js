import { handle } from './handle'

import { isFunction, last } from './internal/utils'

export function pump (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      pump(...args, err => (err ? reject(err) : resolve()))
    )
  }

  const callback = args.pop()
  if (args.length < 2) {
    callback(new Error('Expected at least two streams to pipe'))
    return
  }

  const streams = args.map((stream, i) => [
    stream,
    {
      readable: i < args.length - 1,
      writable: i > 0
    }
  ])

  handle(...streams, callback)

  args.reduce((a, b) => a.pipe(b))
}
