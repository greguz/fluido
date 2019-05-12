import { Writable } from 'stream'

import { write } from './internal/void'

export function writable (options) {
  return new Writable({ write, ...options })
}
