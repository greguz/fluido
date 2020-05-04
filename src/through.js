import { Transform } from './Transform'

export function through (options, transform, flush) {
  if (isFunction(options)) {
    flush = transform
    transform = options
    options = {}
  }

  return new Transform({
    ...options,
    transform,
    flush
  })
}
