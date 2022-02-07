import { Duplex, finished } from 'readable-stream'

import { destroyStream } from './lib/destroy.mjs'
import { isPlainObject } from './lib/util.mjs'

import { isReadable, isWritable } from './is.mjs'

function toDestroyer (stream) {
  let destroyed = false
  return function destroyer (err) {
    if (!stream.__closed__ && !destroyed) {
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
  const options = isPlainObject(streams[0]) ? streams.shift() : {}

  const readables = streams.filter(isReadable)
  const writables = streams.filter(isWritable)
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
