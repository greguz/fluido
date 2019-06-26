import { Readable } from 'stream'
import { voidRead } from './internal/void'
import wrap from './internal/from'

export function readable (options = {}) {
  const read = options.read || voidRead

  return new Readable({
    ...options,
    read: read.length >= 2 ? wrap(read) : read
  })
}
