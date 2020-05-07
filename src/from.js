import { Readable } from './Readable'

import { isFunction } from './internal/util'

function noSource (size, callback) {
  callback(null, null)
}

export function from (options, asyncRead) {
  if (isFunction(options)) {
    asyncRead = options
    options = {}
  }

  return new Readable({
    ...options,
    asyncRead: asyncRead || noSource
  })
}
