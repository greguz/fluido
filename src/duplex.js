import { Duplex } from 'stream'
import { voidRead, voidWrite } from './internal/void'
import wrap from './internal/from'

export function duplex (options = {}) {
  const read = options.read || voidRead
  const write = options.write || voidWrite

  return new Duplex({
    ...options,
    read: read.length >= 2 ? wrap(read) : read,
    write
  })
}
