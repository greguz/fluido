import util from 'util'

export { inherits } from 'util'

export function noop () {
  // Nothing
}

export function isFunction (value) {
  return typeof value === 'function'
}

export function last (arr) {
  return arr.length > 0 ? arr[arr.length - 1] : undefined
}

export function isPromise (value) {
  return util.types.isPromise(value)
}

export function once (callback) {
  let called = false
  return function (err, res) {
    if (called) return
    called = true
    callback(err, res)
  }
}
