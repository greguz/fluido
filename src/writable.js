import { Writable } from 'readable-stream'

import supportConcurrency from './internal/concurrency'
import supportPromises from './internal/promises'
import { voidWrite } from './internal/void'

function handleConcurrency (options) {
  const { concurrency, write, final, destroy } = options

  return concurrency
    ? supportConcurrency(concurrency, write, final, destroy)
    : [write, final, destroy]
}

export function writable (options = {}) {
  options = supportPromises(options)

  const [write, final, destroy] = handleConcurrency(options)
  const { writev } = options

  return new Writable({
    ...options,
    write: !write && !writev ? voidWrite : write,
    writev,
    final,
    destroy
  })
}
