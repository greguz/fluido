import { Readable } from 'stream'

import { read } from './void'

/**
 * Creates a readable stream
 */
export function readable(options) {
  return new Readable({ read, ...options })
}
