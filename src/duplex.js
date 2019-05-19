import { Duplex } from 'stream'
import { read, write } from './internal/void'

export function duplex (options) {
  return new Duplex({ read, write, ...options })
}
