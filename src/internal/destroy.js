import { isFunction } from './util'

function isRequest (stream) {
  return !!stream.setHeader && isFunction(stream.abort)
}

export function destroyStream (stream, err) {
  if (isRequest(stream)) {
    stream.abort()
  } else if (isFunction(stream.destroy)) {
    stream.destroy(err)
  }
}
