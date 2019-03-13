import { Transform } from 'stream'

import { concurrent } from './concurrent'
import { transform as vTransform } from './void'

export function transform (options) {
  if (options && options.concurrency !== undefined) {
    return concurrent(options)
  } else {
    return new Transform({ transform: vTransform, ...options })
  }
}
