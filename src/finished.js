import { eos } from './eos'
import { isFunction, last } from './internal/utils'

function readOptions (options, index) {
  return Array.isArray(options) ? options[index] : options
}

export function _finished (streams, options, callback) {
  let count = streams.length
  let error

  const end = err => {
    error = error || err || null
    if (--count < 1) {
      callback(error)
    }
  }

  for (let i = 0; i < streams.length; i++) {
    eos(streams[i], readOptions(options, i), end)
  }
}

export function finished (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      finished(...args, err => (err ? reject(err) : resolve()))
    )
  }
  const callback = args.pop()
  if (args.length <= 0) {
    process.nextTick(callback, null)
  } else {
    _finished(args, {}, callback)
  }
}
