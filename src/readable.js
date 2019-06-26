import { Readable } from 'stream'
import { voidRead } from './internal/void'

export function readable (options) {
  return new Readable({
    read: voidRead,
    ...options
  })
}
