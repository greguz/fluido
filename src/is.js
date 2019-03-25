import { Readable, Writable, Duplex, Transform } from 'stream'

export function isReadable (value) {
  return value instanceof Readable
}

export function isWritable (value) {
  return value instanceof Writable
}

export function isDuplex (value) {
  return value instanceof Duplex
}

export function isTransform (value) {
  return value instanceof Transform
}

export function isStream (value) {
  return isReadable(value) || isWritable(value)
}

export function isReadableStrictly (value) {
  return isReadable(value) && !isWritable(value)
}

export function isWritableStrictly (value) {
  return isWritable(value) && !isReadable(value)
}

export function isDuplexStrictly (value) {
  return isDuplex(value) && !isTransform(value)
}
