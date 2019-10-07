import { finished } from 'readable-stream'

import { isFunction, noop } from './internal/utils'

export function eos (stream, options, callback) {
  // Handle optional argument
  if (isFunction(options)) {
    return eos(stream, {}, options)
  }

  // Support promise return
  if (!callback) {
    return new Promise((resolve, reject) =>
      eos(stream, options, err => (err ? reject(err) : resolve()))
    )
  }

  const clean = finished(stream, options, err => {
    // Prevent future error throwing
    stream.addListener('error', noop)
    // Clean used listeners
    clean()
    // Fire the callback
    callback(err)
  })
}
