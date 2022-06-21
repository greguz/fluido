import { Stream } from 'readable-stream'

export function isNodeStream (obj) {
  return isReadableStream(obj) || isWritableStream(obj)
}

export function isReadableStream (value) {
  return value instanceof Stream && typeof value.push === 'function'
}

export function isWritableStream (value) {
  return value instanceof Stream && typeof value.write === 'function'
}

export function isDuplexStream (value) {
  return isReadableStream(value) && isWritableStream(value)
}
