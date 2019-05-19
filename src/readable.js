import { Readable } from 'stream'
import { read } from './internal/void'

export function readable (options) {
  return new Readable({ read, ...options })
}
