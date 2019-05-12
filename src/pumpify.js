import { readify } from './readify'
import { writify } from './writify'

import { isReadableStrictly, isWritableStrictly } from './is'

import { first, last } from './internal/utils'

export function pumpify (streams, options) {
  if (streams.length <= 0) {
    throw new Error('Expected at least one stream')
  } else if (streams.length === 1) {
    return streams[0]
  }

  const asReadable = isReadableStrictly(first(streams))
  const asWritable = isWritableStrictly(last(streams))

  if (asReadable === asWritable) {
    throw new Error('Unable to guess the resulting stream')
  }

  return asReadable ? readify(streams, options) : writify(streams, options)
}
