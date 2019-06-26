import { Writable } from 'stream'
import { concurrent } from './internal/concurrentWritable'
import { voidWrite } from './internal/void'

export function writable (options) {
  if (options && options.concurrency !== undefined) {
    return concurrent(options)
  } else {
    return new Writable({ write: voidWrite, ...options })
  }
}
