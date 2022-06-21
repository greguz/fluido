export function asCallback (fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('A callback must be a function')
  }
  fn[Symbol.for('callback')] = true
  return fn
}

export function isCallback (fn) {
  return typeof fn === 'function' && Symbol.for('callback') in fn
}
