import { Readable } from './Readable'

import { isFunction } from './internal/util'

export function from (options, asyncRead) {
  if (isFunction(options)) {
    asyncRead = options
    options = {}
  }

  return new Readable({
    ...options,
    asyncRead
  })
}
