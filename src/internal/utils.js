export function noop () {}

export function isFunction (value) {
  return typeof value === 'function'
}

export function first (arr) {
  return arr[0]
}

export function last (arr) {
  return arr.length > 0 ? arr[arr.length - 1] : undefined
}

export function destroyStream (stream, err) {
  err = err || new Error('Premature close')

  if (stream.setHeader && typeof stream.abort === 'function') {
    stream.abort()
  } else if (typeof stream.destroy === 'function') {
    stream.destroy(err)
  } else {
    stream.emit('error', err)
  }

  return err
}
