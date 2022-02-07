import { isFunction, isPromise } from './util.mjs'

export function handlePromise (fn) {
  if (!isFunction(fn)) {
    return fn
  }
  return Object.defineProperty(
    function (...args) {
      const callback = args[args.length - 1]
      const out = fn.call(this, ...args)
      if (isPromise(out)) {
        out
          .then(result => callback(null, result))
          .catch(callback)
      }
    },
    'name',
    { value: fn.name }
  )
}
