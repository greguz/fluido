import { Transform } from 'stream'

function toString(chunks, encoding) {
  const decoder = new TextDecoder(encoding)
  let result = ''
  for (const chunk of chunks) {
    if (Buffer.isBuffer(chunk)) {
      result += chunk.toString(encoding)
    } else if (chunk instanceof Uint8Array) {
      result += decoder.decode(chunk)
    } else {
      throw new Error('Chunk must be buffer, string or Uint8Array')
    }
  }
  return result
}

function toBuffer(chunks) {
  let result = Buffer.from([])
  for (const chunk of chunks) {
    if (Buffer.isBuffer(chunk) || chunk instanceof Uint8Array) {
      result = Buffer.concat([result, chunk])
    } else {
      throw new Error('Chunk must be buffer, string or Uint8Array')
    }
  }
  return result
}

export function collect(encoding) {
  let chunks = []

  return new Transform({
    objectMode: true,
    transform(chunk, ce, callback) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk, ce) : chunk)
      callback()
    },
    flush(callback) {
      if (encoding === undefined) {
        if (Buffer.isBuffer(chunks[0])) {
          encoding = 'buffer'
        } else {
          encoding = false
        }
      }

      let err
      let data
      try {
        if (encoding === 'buffer') {
          data = toBuffer(chunks)
        } else if (typeof encoding === 'string') {
          data = toString(chunks, encoding)
        } else {
          data = chunks
        }
      } catch (e) {
        err = e
      }

      chunks = []
      callback(err, data)
    },
    destroy(err, callback) {
      chunks = []
      callback(err)
    }
  })
}
