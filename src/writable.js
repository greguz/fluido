import { Writable } from 'stream'
import concurrent from './internal/concurrent'
import { voidWrite } from './internal/void'

export function writable (options = {}) {
  if (options.concurrency) {
    const [write, final, destroy] = concurrent(
      options.concurrency,
      options.write,
      options.final,
      options.destroy
    )

    return new Writable({
      ...options,
      write,
      final,
      destroy
    })
  } else {
    return new Writable({ write: voidWrite, ...options })
  }
}
