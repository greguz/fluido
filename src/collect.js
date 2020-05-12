import { Transform } from 'readable-stream'

function isBufferish (chunk) {
  return Buffer.isBuffer(chunk) || chunk instanceof Uint8Array
}

function guessTarget ({ chunk, encoding }) {
  if (isBufferish(chunk)) {
    return 'buffer'
  } else if (typeof chunk === 'string') {
    return encoding
  } else {
    return false
  }
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

function toString ({ chunk, encoding }) {
  if (typeof chunk === 'string') {
    return chunk
  } else if (Buffer.isBuffer(chunk)) {
    return chunk.toString(encoding)
  } else if (chunk instanceof Uint8Array) {
    return Buffer.from(chunk).toString(encoding)
  } else {
    return chunk.toString()
  }
}

function asString (items) {
  return items.map(toString).join('')
}

function compileItems (items, target) {
  if (target === undefined && items.length > 0) {
    target = guessTarget(items[0])
  }
  if (target === 'buffer') {
    return asBuffer(items)
  } else if (target === 'string') {
    return asString(items, target)
  } else {
    return items.map(item => item.chunk)
  }
}

export function collect (target) {
  if (target !== undefined && target !== false && target !== 'string' && target !== 'buffer') {
    throw new TypeError('Invalid target')
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
