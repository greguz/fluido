import { once } from './util.mjs'

function makeConcurrentMethods (concurrency, _write, _final) {
  if (!Number.isInteger(concurrency) || concurrency < 2) {
    throw new TypeError('Invalid concurrency')
  }

  // Active jobs counter
  let jobs = 0

  // First encountered error
  let error

  // Require more chunks callback
  let next

  // End stream callback
  let close

  function concurrentWrite (chunk, encoding, callback) {
    if (!error) {
      jobStart(this, chunk, encoding)
    }

    if (!error && jobs < concurrency) {
      // Keep requiring more chunks
      callback()
    } else {
      // Save the current callback for jobs completion
      next = callback
    }
  }

  function jobStart (stream, chunk, encoding) {
    jobs++
    _write.call(
      stream,
      chunk,
      encoding,
      once((err, data) => jobEnd(stream, err, data))
    )
  }

  function jobEnd (stream, err, data) {
    jobs--
    error = error || err

    if (!error && data !== undefined && stream.push) {
      stream.push(data)
    }

    if (jobs <= 0) {
      const callback = close || next
      if (callback) {
        callback(error)
      } else if (error) {
        stream.emit('error', error)
      }
    } else if (!error && next) {
      const callback = next
      next = undefined
      callback()
    }
  }

  function concurrentFinal (callback) {
    // Build close callback
    close = err => {
      if (err || !_final) {
        callback(err)
      } else {
        _final.call(this, callback)
      }
    }

    if (jobs <= 0) {
      close()
    }
  }

  return [concurrentWrite, concurrentFinal]
}

export function patchWritable (stream, concurrency) {
  const [_write, _final] = makeConcurrentMethods(
    concurrency,
    stream._write,
    stream._final
  )
  stream._write = _write
  stream._final = _final
}

export function patchTransform (stream, concurrency) {
  const [_transform, _flush] = makeConcurrentMethods(
    concurrency,
    stream._transform,
    stream._flush
  )
  stream._transform = _transform
  stream._flush = _flush
}
