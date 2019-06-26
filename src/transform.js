import { Transform } from 'stream'
import { concurrent } from './internal/concurrentTransform'
import { voidTransform } from './internal/void'

export function transform (options) {
  if (options && options.concurrency !== undefined) {
    return concurrent(options)
  } else {
    return new Transform({ transform: voidTransform, ...options })
  }
}
