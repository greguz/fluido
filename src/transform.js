import { Transform } from 'readable-stream'

import supportConcurrency from './internal/concurrency'
import supportPromises from './internal/promises'
import { voidTransform } from './internal/void'

function handleConcurrency (options) {
  const { concurrency, transform, flush, destroy } = options

  return concurrency
    ? supportConcurrency(concurrency, transform, flush, destroy, true)
    : [transform, flush, destroy]
}

export function transform (options = {}) {
  options = supportPromises(options)

  const [transform, flush, destroy] = handleConcurrency(options)

  return new Transform({
    ...options,
    transform: transform || voidTransform,
    flush,
    destroy
  })
}
