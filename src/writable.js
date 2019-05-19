import { Writable } from 'stream'
import { concurrent } from './internal/concurrentWritable'
import { write } from './internal/void'

export function writable (options) {
  if (options && options.concurrency !== undefined) {
    return concurrent(options)
  } else {
    return new Writable({ write, ...options })
  }
}
