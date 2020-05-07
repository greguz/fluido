import { Readable } from './Readable'

import { isFunction } from './internal/util'
import { noSource } from './internal/void'

export function from (options, asyncRead) {
  if (isFunction(options)) {
    asyncRead = options
    options = {}
  }

  return new Readable({
    ...options,
    read: !asyncRead ? noSource : undefined,
    asyncRead
  })
}
