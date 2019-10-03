import { transform } from './transform'

function asString (chunks, encoding, callback) {
  let result = ''

  for (const chunk of chunks) {
    if (!Buffer.isBuffer(chunk)) {
      process.nextTick(callback, new TypeError('Chunk must be buffer or string'))
      return
    }
    result += chunk.toString(encoding)
  }

  process.nextTick(callback, null, result)
}

function asBuffer (chunks, callback) {
  let result = Buffer.from([])

  for (const chunk of chunks) {
    if (!Buffer.isBuffer(chunk)) {
      process.nextTick(callback, new TypeError('Chunk must be buffer or string'))
      return
    }
    result = Buffer.concat([result, chunk])
  }

  process.nextTick(callback, null, result)
}

function asIs (chunks, callback) {
  process.nextTick(callback, null, chunks)
}

export function collect (encoding) {
  let chunks = []

  return transform({
    objectMode: true,
    transform (chunk, ce, callback) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk, ce) : chunk)
      callback()
    },
    flush (callback) {
      if (encoding === undefined) {
        if (Buffer.isBuffer(chunks[0])) {
          encoding = 'buffer'
        } else {
          encoding = false
        }
      }

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
