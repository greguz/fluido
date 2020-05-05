import { Transform } from 'readable-stream'

function guessTarget ({ chunk, encoding }) {
  if (Buffer.isBuffer(chunk) || chunk instanceof Uint8Array) {
    return 'buffer'
  } else if (typeof chunk === 'string') {
    return encoding
  } else {
    return false
  }
}

function isBufferish (chunk) {
  return Buffer.isBuffer(chunk) || chunk instanceof Uint8Array
}

function asBuffer (items) {
  return Buffer.concat(
    items.map(
      ({ chunk, encoding }) => isBufferish(chunk)
        ? chunk
        : Buffer.from(chunk, encoding)
    )
  )
}

function asString (items, encoding) {
  return asBuffer(items).toString(encoding)
}

function compileItems (items, target) {
  if (!target && items.length > 0) {
    target = guessTarget(items[0])
  }
  if (target === 'buffer') {
    return asBuffer(items)
  } else if (typeof target === 'string') {
    return asString(items, target)
  } else {
    return items
  }
}

export function collect (target) {
  if (typeof target !== 'string' && target !== false) {
    throw new TypeError()
  }
  const items = []
  return new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      items.push({ chunk, encoding })
      callback()
    },
    flush (callback) {
      let err = null
      let res
      try {
        res = compileItems(items, target)
      } catch (e) {
        err = e
      }
      callback(err, res)
    }
  })
}
