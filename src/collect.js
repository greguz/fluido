import { transform } from './transform'

function asString (chunks, encoding, callback) {
  let result = ''
  for (const chunk of chunks) {
    if (Buffer.isBuffer(chunk)) {
      result += chunk.toString(encoding)
    } else if (typeof chunk === 'string') {
      result += chunk
    } else {
      return callback(new TypeError('Chunk must be buffer or string'))
    }
  }
  callback(null, result)
}

function asBuffer (chunks, callback) {
  let result = Buffer.from([])
  for (const chunk of chunks) {
    if (Buffer.isBuffer(chunk)) {
      result = Buffer.concat([result, chunk])
    } else if (typeof chunk === 'string') {
      result = Buffer.concat([result, Buffer.from(chunk)])
    } else {
      return callback(new TypeError('Chunk must be buffer or string'))
    }
  }
  callback(null, result)
}

function asIs (chunks, callback) {
  callback(null, chunks)
}

export function collect (target) {
  let chunks = []

  return transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      if (target === undefined) {
        if (Buffer.isBuffer(chunk)) {
          target = 'buffer'
        } else if (typeof chunk === 'string') {
          target = 'utf8'
        } else {
          target = false
        }
      }
      chunks.push(
        typeof chunk === 'string' && target === 'buffer'
          ? Buffer.from(chunk, encoding)
          : chunk
      )
      callback()
    },
    flush (callback) {
      if (target === 'buffer') {
        asBuffer(chunks, callback)
      } else if (typeof target === 'string') {
        asString(chunks, target, callback)
      } else {
        asIs(chunks, callback)
      }
      chunks = []
    },
    destroy (err, callback) {
      chunks = []
      callback(err)
    }
  })
}
