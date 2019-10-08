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

export function once (fn) {
  let called = false
  return function (err, data) {
    if (called) return
    called = true
    fn(err, data)
  }
}
