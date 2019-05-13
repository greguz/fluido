import { Transform } from 'stream'

export function concurrent (options) {
  const {
    concurrency,
    transform: _transform,
    flush: _flush,
    destroy: _destroy
  } = options

  if (
    typeof concurrency !== 'number' ||
    isNaN(concurrency) ||
    concurrency <= 0
  ) {
    throw new TypeError('Concurrency must be a positive number')
  }

  if (typeof _transform !== 'function') {
    throw new Error('On concurrent mode the transform method is mandatory')
  }

  let jobs = 0

  let erTransform
  let cbTransform
  let cbFlush
  let cbDestroy

  function transform (chunk, encoding, callback) {
    if (!erTransform && !cbDestroy) {
      job.call(this, chunk, encoding)
    }

    if (jobs < concurrency && !erTransform && !cbDestroy) {
      callback()
    } else {
      cbTransform = callback
    }
  }

  function job (chunk, encoding) {
    jobs++

    _transform.call(this, chunk, encoding, (err, data) => {
      jobs--

      erTransform = erTransform || err

      if (data && !erTransform && !cbDestroy) {
        this.push(data)
      }

      if (jobs <= 0) {
        if (cbDestroy) {
          cbDestroy()
        } else if (cbFlush) {
          cbFlush(erTransform)
        } else if (erTransform && cbTransform) {
          cbTransform(erTransform)
        } else if (erTransform) {
          this.emit('error', erTransform)
        }
      } else if (cbTransform && !erTransform && !cbDestroy) {
        const callback = cbTransform
        cbTransform = undefined
        callback()
      }
    })
  }

  function flush (callback) {
    cbFlush = err => {
      if (err || !_flush) {
        callback(err)
      } else {
        _flush.call(this, callback)
      }
    }

    if (jobs <= 0) {
      cbFlush()
    }
  }

  function destroy (err, callback) {
    cbDestroy = _destroy ? _destroy.bind(this, err, callback) : callback

    if (jobs <= 0) {
      cbDestroy()
    }
  }

  return new Transform({
    ...options,
    transform,
    flush,
    destroy
  })
}
