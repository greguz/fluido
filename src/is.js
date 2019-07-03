import { EventEmitter } from 'events'

import { isFunction } from './internal/utils'

export function isReadable (value) {
  return value instanceof EventEmitter && isFunction(value.push)
}

export function isWritable (value) {
  return value instanceof EventEmitter && isFunction(value.write)
}

export function isStream (value) {
  return isReadable(value) || isWritable(value)
}

export function isDuplex (value) {
  return isReadable(value) && isWritable(value)
}

export function isReadableStrictly (value) {
  return isReadable(value) && !isWritable(value)
}

export function isWritableStrictly (value) {
  return isWritable(value) && !isReadable(value)
}
