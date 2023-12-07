import { once } from './util.mjs'

function makeConcurrentMethods (concurrency, _write, _final) {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new TypeError('Concurrency must be a positive integer')
  }
  if (concurrency === 1) {
    return [_write, _final]
  }

  // Active jobs counter
  let jobs = 0

  // First encountered error
  let reason = null

  // Job end callback
  let done = noop

  function concurrentWrite (chunk, encoding, callback) {
    if (reason) {
      callback(reason)
      return
    }

    jobs++
    _write(chunk, encoding, (err, result) => {
      jobs--

      if (err && !reason) {
        reason = err
      }

      if (!reason && result !== undefined && this.push) {
        this.push(result)
      }

      done(reason)
    })

    if (jobs < concurrency) {
      callback(reason)
    } else {
      done = once(callback)
    }
  }

  function concurrentFinal (callback) {
    done = () => {
      if (reason) {
        callback(reason)
      } else if (jobs <= 0) {
        if (_final) {
          _final(callback)
        } else {
          callback(null)
        }
      }
    }
  }

  return [concurrentWrite, concurrentFinal]
}

function noop () {
  // nothing to do
}

export function patchWritable (writable, concurrency) {
  const [_write, _final] = makeConcurrentMethods(
    concurrency,
    bind(writable._write, writable),
    bind(writable._final, writable)
  )
  writable._write = _write
  writable._final = _final
}

export function patchTransform (transform, concurrency) {
  const [_transform, _flush] = makeConcurrentMethods(
    concurrency,
    bind(transform._transform, transform),
    bind(transform._flush, transform)
  )
  transform._transform = _transform
  transform._flush = _flush
}

function bind (fn, obj) {
  return typeof fn === 'function'
    ? fn.bind(obj)
    : fn
}
