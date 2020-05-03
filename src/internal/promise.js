import { isFunction, isPromise, last } from './util'

export function handlePromise (method) {
  if (!isFunction(method)) {
    return method
  }
  return function fluidoMethod (...args) {
    const callback = last(args)
    const out = method.call(this, ...args)
    if (isPromise(out)) {
      out
        .then(result => callback(null, result))
        .catch(callback)
    }
  }
}
