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

export function collect (encoding) {
  let chunks = []

  return transform({
    objectMode: true,
    transform (chunk, ce, callback) {
      if (encoding === undefined) {
        if (Buffer.isBuffer(chunk)) {
          encoding = 'buffer'
        } else if (typeof chunk === 'string') {
          encoding = 'utf8'
        } else {
          encoding = false
        }
      }
      chunks.push(
        typeof chunk === 'string' && encoding === 'buffer'
          ? Buffer.from(chunk, ce)
          : chunk
      )
      callback()
    },
    flush (callback) {
      if (encoding === 'buffer') {
        asBuffer(chunks, callback)
      } else if (typeof encoding === 'string') {
        asString(chunks, encoding, callback)
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
