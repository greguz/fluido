export function handlePromise (fn) {
  if (typeof fn !== 'function') {
    return fn
  }
  return Object.defineProperty(
    function (...args) {
      const callback = args[args.length - 1]
      const value = fn.call(this, ...args)
      if (isPromiseLike(value)) {
        value.then(
          result => callback(null, result),
          callback
        )
      }
    },
    'name',
    { value: fn.name }
  )
}

export function isPromiseLike (value) {
  return typeof Object(value).then === 'function'
}
