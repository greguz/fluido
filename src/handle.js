import { finished } from './finished'

import { compose, isFunction, last } from './internal/utils'

function toDestroyer (stream) {
  let closed = false
  let destroyed = false

  finished(stream, () => (closed = true))

  return function destroyer (err) {
    if (closed || destroyed) return
    destroyed = true
    stream.destroy(err)
  }
}

export function handle (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      handle(...args, err => (err ? reject(err) : resolve()))
    )
  }

  const callback = args.pop()

  if (args.length <= 0) {
    return process.nextTick(callback)
  }

  const destroyer = args.map(toDestroyer).reduce(compose)

  let ended = 0
  let error = null

  const end = serr => {
    ended++
    error = error || serr

    if (error) {
      destroyer(error)
    }

    if (ended >= args.length) {
      callback(error)
    }
  }

  for (const stream of args) {
    finished(stream, end)
  }
}
