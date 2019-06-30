import { finished } from './finished'
import { isFunction, last, destroyStream } from './internal/utils'

export function compose (a, b) {
  return function (arg) {
    a(arg)
    b(arg)
  }
}

function toDestroyer (stream) {
  let destroyed = false

  return function destroyer (err) {
    if (!stream.__closed__ && !destroyed) {
      destroyed = true
      destroyStream(stream, err)
    }
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

  const destroy = args.map(toDestroyer).reduce(compose)

  let ended = 0
  let error = null

  const end = err => {
    ended++
    error = error || err

    if (error) {
      destroy(error)
    }

    if (ended >= args.length) {
      callback(error)
    }
  }

  for (const stream of args) {
    finished(stream, err => {
      stream.__closed__ = true
      end(err)
    })
  }
}
