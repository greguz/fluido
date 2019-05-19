import { Transform } from 'stream'
import { concurrent } from './internal/concurrentTransform'
import { transform as vTransform } from './internal/void'

export function transform (options) {
  if (options && options.concurrency !== undefined) {
    return concurrent(options)
  } else {
    return new Transform({ transform: vTransform, ...options })
  }
}
