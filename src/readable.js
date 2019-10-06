import { Readable } from 'stream'

import supportPromises from './internal/promises'
import { voidRead } from './internal/void'

export function readable (options = {}) {
  options = supportPromises(options)

  return new Readable({
    ...options,
    read: options.read || voidRead
  })
}
