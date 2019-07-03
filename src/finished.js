import { eos } from './eos'
import { isFunction, last } from './internal/utils'

function readStream (data) {
  return Array.isArray(data) ? data[0] : data
}

function readOptions (data) {
  return Array.isArray(data) ? data[1] : {}
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
    return
  }

  let count = args.length
  let error

  const end = err => {
    error = error || err || null
    if (--count < 1) {
      callback(error)
    }
  }

  for (const data of args) {
    eos(readStream(data), readOptions(data), end)
  }
}
