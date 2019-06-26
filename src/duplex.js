import { Duplex } from 'stream'
import { voidRead, voidWrite } from './internal/void'

export function duplex (options) {
  return new Duplex({
    read: voidRead,
    write: voidWrite,
    ...options
  })
}
