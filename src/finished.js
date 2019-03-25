import { finished as eos } from 'stream'

import { last, isFunction, noop } from './utils'

function compose (fna, fnb) {
  return () => {
    fna()
    fnb()
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
    return process.nextTick(callback)
  } else if (args.length === 1) {
    return eos(args[0], callback)
  }

  let ended = 0
  let error = null

  const end = err => {
    error = error || err
    if (++ended >= args.length) {
      callback(error)
    }
  }

  return args.reduce((acc, stream) => compose(acc, eos(stream, end)), noop)
}
