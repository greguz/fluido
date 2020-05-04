import { Writable } from './Writable'

import { isFunction } from './internal/util'

export function to (options, write, final) {
  if (isFunction(options)) {
    final = write
    write = options
    options = {}
  }

  return new Writable({
    ...options,
    write,
    final
  })
}
