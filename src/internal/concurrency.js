export default function supportConcurrency (
  concurrency,
  _transform,
  _flush,
  _destroy,
  isWritable = false
) {
  if (!Number.isInteger(concurrency) || concurrency <= 0) {
    throw new TypeError('Concurrency must be a positive integer')
  }
  if (typeof _transform !== 'function') {
    throw new TypeError(
      isWritable
        ? 'Write function is required'
        : 'Transform function is required'
    )
  }

  // Active jobs counter
  let jobs = 0

  // First encountered error
  let error

  // Require more chunks callback
  let next

  // End stream callback
  let close

  function transform (chunk, encoding, callback) {
    if (!error) {
      job.call(this, chunk, encoding)
    }

    if (!error && jobs < concurrency) {
      // Keep requiring more chunks
      callback()
    } else {
      // Save the current callback for jobs completion
      next = callback
    }
  }

  function job (chunk, encoding) {
    jobs++

    _transform.call(this, chunk, encoding, (err, data) => {
      jobs--

      error = error || err

      if (!error && data !== undefined && data !== null && !isWritable) {
        this.push(data)
      }

      if (jobs <= 0) {
        const callback = close || next
        if (callback) {
          callback(error)
        } else if (error) {
          this.emit('error', error)
        }
      } else if (!error && next) {
        const callback = next
        next = undefined
        callback()
      }
    })
  }

  function flush (callback) {
    // Build close callback
    close = err => {
      if (err || !_flush) {
        callback(err)
      } else {
        _flush.call(this, callback)
      }
    }

    if (jobs <= 0) {
      close()
    }
  }

  function destroy (err, callback) {
    // Ensure error to stop data flowing
    error = error || err || new Error('Premature close')

    // Build close callback
    close = _destroy ? _destroy.bind(this, error, callback) : callback

    if (jobs <= 0) {
      close()
    }
  }

  return [transform, flush, destroy]
}
