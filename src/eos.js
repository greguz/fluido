import { finished } from 'readable-stream'

import { isFunction } from './internal/utils'

export function eos (stream, options, callback) {
  if (isFunction(options)) {
    return eos(stream, {}, options)
  }
  if (!isFunction(callback)) {
    throw new TypeError('Expected callback')
  }
  return finished(stream, options, callback)
}
