import { Transform } from 'stream'
import concurrent from './internal/concurrent'
import { voidTransform } from './internal/void'

export function transform (options = {}) {
  if (options.concurrency) {
    const [transform, flush, destroy] = concurrent(
      options.concurrency,
      options.transform,
      options.flush,
      options.destroy
    )

    return new Transform({
      ...options,
      transform,
      flush,
      destroy
    })
  } else {
    return new Transform({ transform: voidTransform, ...options })
  }
}
