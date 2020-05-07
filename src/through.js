import { Transform } from './Transform'

import { isFunction } from './internal/util'

function passthrough (chunk, encoding, callback) {
  callback(null, chunk)
}

export function through (options, transform, flush) {
  if (isFunction(options)) {
    flush = transform
    transform = options
    options = {}
  }

  return new Transform({
    ...options,
    transform: transform || passthrough,
    flush
  })
}
