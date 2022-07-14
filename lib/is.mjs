export function isNodeStream (obj) {
  return isReadableStream(obj) || isWritableStream(obj)
}

export function isReadableStream (value) {
  return typeof value === 'object' &&
    value !== null &&
    typeof value.on === 'function' &&
    typeof value.pipe === 'function' &&
    typeof value.push === 'function'
}

export function isWritableStream (value) {
  return typeof value === 'object' &&
    value !== null &&
    typeof value.on === 'function' &&
    typeof value.write === 'function' &&
    typeof value.end === 'function'
}

export function isDuplexStream (value) {
  return isReadableStream(value) && isWritableStream(value)
}
