import { Duplex } from 'stream'

import supportConcurrency from './internal/concurrency'
import supportPromises from './internal/promises'
import { voidRead, voidWrite } from './internal/void'

function handleConcurrency (options) {
  const { concurrency, write, final, destroy } = options

  return concurrency
    ? supportConcurrency(concurrency, write, final, destroy, true)
    : [write, final, destroy]
}

export function duplex (options = {}) {
  options = supportPromises(options)

  const [write, final, destroy] = handleConcurrency(options)
  const { read, writev } = options

  return new Duplex({
    ...options,
    read: read || voidRead,
    write: !write && !writev ? voidWrite : write,
    writev,
    final,
    destroy
  })
}
