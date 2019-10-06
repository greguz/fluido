export function noop () {}

export function isFunction (value) {
  return typeof value === 'function'
}

export function last (arr) {
  return arr.length > 0 ? arr[arr.length - 1] : undefined
}

export function isPromise (value) {
  return value instanceof Promise
}
