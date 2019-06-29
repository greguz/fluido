import { EventEmitter } from 'events'

export function isReadable (value) {
  return value instanceof EventEmitter && typeof value.push === 'function'
}

export function isWritable (value) {
  return value instanceof EventEmitter && typeof value.write === 'function'
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
