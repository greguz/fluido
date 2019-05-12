import { finished as eos } from 'stream'

import { isStream } from './is'

import { isFunction, last } from './internal/utils'

export function finished (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      finished(...args, err => (err ? reject(err) : resolve()))
    )
  }

  const callback = args.pop()

  for (const stream of args) {
    if (!isStream(stream)) {
      return callback(new TypeError('Expected a stream'))
    }
  }

  if (args.length <= 0) {
    return process.nextTick(callback)
  } else if (args.length === 1) {
    return eos(args[0], callback)
  }

  let ended = 0
  let error = null

  const end = serr => {
    ended++
    error = error || serr

    if (ended >= args.length) {
      callback(error)
    }
  }

  for (const stream of args) {
    eos(stream, end)
  }
}
