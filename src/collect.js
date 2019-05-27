import { Transform } from 'stream'

function toString (chunks, encoding, callback) {
  const decoder = new TextDecoder(encoding)
  let result = ''

  for (const chunk of chunks) {
    if (Buffer.isBuffer(chunk)) {
      result += chunk.toString(encoding)
    } else if (chunk instanceof Uint8Array) {
      result += decoder.decode(chunk)
    } else {
      callback(new Error('Chunk must be buffer, string or Uint8Array'))
      return
    }
  }

  callback(null, result)
}

function toBuffer (chunks, callback) {
  let result = Buffer.from([])

  for (const chunk of chunks) {
    if (Buffer.isBuffer(chunk) || chunk instanceof Uint8Array) {
      result = Buffer.concat([result, chunk])
    } else {
      callback(new Error('Chunk must be buffer, string or Uint8Array'))
      return
    }
  }

  callback(null, result)
}

export function collect (encoding) {
  let chunks = []

  return new Transform({
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
        toBuffer(chunks, callback)
      } else if (typeof encoding === 'string') {
        toString(chunks, encoding, callback)
      } else {
        callback(null, chunks)
      }

      chunks = []
    },
    destroy (err, callback) {
      chunks = []
      callback(err)
    }
  })
}
