import { Duplex, finished } from 'readable-stream'

import { isNodeStream, isReadableStream, isWritableStream } from './is.mjs'

const kFinished = Symbol('kFinished')

function emitCloseLegacy (stream) {
  stream.emit('close')
}

function emitErrorCloseLegacy (stream, err) {
  stream.emit('error', err)
  process.nextTick(emitCloseLegacy, stream)
}

function destroyStream (stream, err) {
  if (stream[kFinished]) {
    return
  }
  if (typeof stream.destroy === 'function') {
    stream.destroy(err)
  } else if (err) {
    process.nextTick(emitErrorCloseLegacy, stream)
  } else {
    process.nextTick(emitCloseLegacy, stream)
  }
}

function toDestroyer (stream) {
  let destroyed = false
  return function destroyer (err) {
    if (!destroyed) {
      destroyed = true
      destroyStream(stream, err)
    }
  }
}

function compose (a, b) {
  return function composed (arg) {
    a(arg)
    b(arg)
  }
}

function handle (streams, options, callback) {
  if (streams.length === 0) {
    process.nextTick(callback, null)
    return
  }

  const destroy = streams.map(toDestroyer).reduce(compose)

  let count = streams.length
  let error = null

  const end = err => {
    error = error || err
    if (error) {
      destroy(error)
    }
    if (--count < 1) {
      callback(error)
    }
  }

  return streams
    .map(
      stream => finished(stream, options, err => {
        stream.__closed__ = true
        end(err)
      })
    )
    .reduce(compose)
}

export function merge (...streams) {
  const last = streams[streams.length - 1]
  const options = typeof last === 'object' && last !== null && !isNodeStream(last)
    ? streams.pop()
    : {}

  const readables = streams.filter(isReadableStream)
  const writables = streams.filter(isWritableStream)
  if (readables.length + writables.length !== streams.length) {
    throw new TypeError('Expected stream')
  }

  let rListener
  let wCallback
  let wError
  let wCounter

  function read () {
    if (!rListener) {
      rListener = data => {
        if (!this.push(data)) {
          for (const stream of readables) {
            stream.pause()
          }
        }
      }

      handle(readables, { readable: true, writable: false }, err => {
        for (const stream of readables) {
          stream.removeListener('data', rListener)
        }

        if (err) {
          this.destroy(err)
        } else {
          this.push(null)
        }
      })

      for (const stream of readables) {
        stream.addListener('data', rListener)
      }
    } else {
      for (const stream of readables) {
        stream.resume()
      }
    }
  }

  function endWrite (err) {
    wError = err || wError
    if (wCallback && wCounter <= 0) {
      const callback = wCallback
      wCallback = undefined
      callback(wError)
    }
  }

  function onDrain () {
    wCounter--
    endWrite()
  }

  function write (chunk, encoding, callback) {
    wCallback = callback
    if (wError) {
      endWrite(wError)
      return
    }

    if (wCounter === undefined) {
      handle(writables, { readable: false, writable: true }, endWrite)
      wCounter = 0
    }

    for (const stream of writables) {
      if (!stream.write(chunk, encoding)) {
        wCounter++
        stream.once('drain', onDrain)
      }
    }

    endWrite()
  }

  function final (callback) {
    if (wCounter === undefined) {
      handle(writables, { readable: false, writable: true }, callback)
    } else {
      wCallback = callback
    }

    for (const target of writables) {
      target.end()
    }
  }

  function destroy (err, callback) {
    for (const stream of streams) {
      destroyStream(stream, err)
    }
    callback(err)
  }

  return new Duplex({
    readable: readables.length > 0,
    writable: writables.length > 0,
    ...options,
    read,
    write,
    writev: undefined,
    final,
    destroy
  })
}
