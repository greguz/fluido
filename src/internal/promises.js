import { isFunction, isPromise } from './utils'
import wrapReadMethod from './read'

function ensureCallback (fn, argsCount) {
  return function (...args) {
    const out = fn.apply(this, args.slice(0, argsCount + 1))
    const callback = args[argsCount]

    if (isPromise(out)) {
      callback(new Error('Overspecialized function'))
    }
  }
}

function ensurePromise (fn, argsCount) {
  return function (...args) {
    const out = fn.apply(this, args.slice(0, argsCount))
    const callback = args[argsCount]

    if (!isPromise(out)) {
      callback(new Error('Expected promise'))
      return
    }

    out
      .then(result => callback(null, result))
      .catch(callback)
  }
}

function wrapMethod (fn, argsCount = 0) {
  return fn.length > argsCount
    ? ensureCallback(fn, argsCount)
    : ensurePromise(fn, argsCount)
}

function ensureFunction (fn) {
  if (!isFunction(fn)) {
    throw new TypeError('Expected a function')
  }
  return fn
}

export default function supportPromises (options) {
  const { read, write, writev, final, destroy, flush, transform } = options

  return {
    ...options,
    read: read ? wrapReadMethod(ensureFunction(read)) : read,
    write: write ? wrapMethod(ensureFunction(write), 2) : write,
    writev: writev ? wrapMethod(ensureFunction(writev), 1) : writev,
    final: final ? wrapMethod(ensureFunction(final)) : final,
    transform: transform ? wrapMethod(ensureFunction(transform), 2) : transform,
    flush: flush ? wrapMethod(ensureFunction(flush)) : flush,
    destroy: destroy ? wrapMethod(ensureFunction(destroy), 1) : destroy
  }
}
