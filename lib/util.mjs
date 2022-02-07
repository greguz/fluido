export { inherits } from 'util'

export function isFunction (value) {
  return typeof value === 'function'
}

export function isPlainObject (value) {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  if (Object.getPrototypeOf(value) === null) {
    return true
  }
  let proto = value
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(value) === proto
}

export function isPromise (value) {
  return typeof Object(value).then === 'function'
}

export function once (callback) {
  let called = false
  return function (err, res) {
    if (called) return
    called = true
    callback(err, res)
  }
}
