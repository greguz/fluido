import { eos } from './eos'
import { isFunction, last, destroyStream } from './internal/utils'

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

function readOptions (options, index) {
  return Array.isArray(options) ? options[index] : options
}

export function _handle (streams, options, callback) {
  const destroy = streams.map(toDestroyer).reduce(compose)

  let count = streams.length
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

  for (let i = 0; i < streams.length; i++) {
    const stream = streams[i]
    eos(stream, readOptions(options, i), err => {
      stream.__closed__ = true
      end(err)
    })
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
    process.nextTick(callback, null)
  } else {
    _handle(args, {}, callback)
  }
}
