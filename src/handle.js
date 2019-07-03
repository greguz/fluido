import { eos } from './eos'

import destroyStream from './internal/destroy'
import { isFunction, last } from './internal/utils'

function compose (a, b) {
  return function composed (arg) {
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

function readStream (data) {
  return Array.isArray(data) ? data[0] : data
}

function readOptions (data) {
  return Array.isArray(data) ? data[1] : {}
}

export function handle (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      handle(...args, err => (err ? reject(err) : resolve()))
    )
  }

  const callback = args.pop()

  if (args.length <= 0) {
    process.nextTick(callback, null)
    return
  }

  const destroy = args.map(readStream).map(toDestroyer).reduce(compose)

  let count = args.length
  let error

  const end = err => {
    error = error || err || null
    if (error) {
      destroy(error)
    }
    if (--count < 1) {
      callback(error)
    }
  }

  for (const data of args) {
    const stream = readStream(data)
    const options = readOptions(data)

    eos(stream, options, err => {
      stream.__closed__ = true
      end(err)
    })
  }
}
