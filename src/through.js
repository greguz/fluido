import { Transform } from './Transform'

import { isFunction } from './internal/util'
import { passthrough } from './internal/void'

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
