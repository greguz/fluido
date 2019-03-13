import { Writable } from 'stream'

import { write } from './void'

export function writable (options) {
  return new Writable({ write, ...options })
}
