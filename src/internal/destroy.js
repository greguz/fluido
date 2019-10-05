import { isFunction } from './utils'

export default function destroyStream (stream, err) {
  err = err || new Error('Premature close')

  if (stream.setHeader && isFunction(stream.abort)) {
    stream.abort()
  } else if (isFunction(stream.destroy)) {
    stream.destroy(err)
  } else {
    process.nextTick(() => stream.emit('error', err))
  }

  return err
}
