import { Duplex } from 'stream'
import { voidRead, voidWrite } from './internal/void'
import wrap from './internal/from'
import concurrent from './internal/concurrent'

function handleConcurrency (options) {
  if (options.concurrency) {
    return concurrent(
      options.concurrency,
      options.write,
      options.final,
      options.destroy,
      true
    )
  } else {
    return [
      options.write || voidWrite,
      options.final,
      options.destroy
    ]
  }
}

export function duplex (options = {}) {
  const read = options.read || voidRead
  const [write, final, destroy] = handleConcurrency(options)

  return new Duplex({
    ...options,
    read: read.length >= 2 ? wrap(read) : read,
    write,
    final,
    destroy
  })
}
