import { Writable } from 'stream'

export function concurrent (options) {
  const {
    concurrency,
    write: _write,
    final: _final,
    destroy: _destroy
  } = options

  if (
    typeof concurrency !== 'number' ||
    isNaN(concurrency) ||
    concurrency <= 0
  ) {
    throw new TypeError('Concurrency must be a positive number')
  }

  if (typeof _write !== 'function') {
    throw new Error('On concurrent mode the write method is mandatory')
  }

  let jobs = 0

  let erWrite
  let cbWrite
  let cbFinal
  let cbDestroy

  function write (chunk, encoding, callback) {
    if (!erWrite && !cbDestroy) {
      job.call(this, chunk, encoding)
    }

    if (jobs < concurrency && !erWrite && !cbDestroy) {
      callback()
    } else {
      cbWrite = callback
    }
  }

  function job (chunk, encoding) {
    jobs++

    _write.call(this, chunk, encoding, err => {
      jobs--

      erWrite = erWrite || err

      if (jobs <= 0) {
        if (cbDestroy) {
          cbDestroy()
        } else if (cbFinal) {
          cbFinal(erWrite)
        } else if (erWrite && cbWrite) {
          cbWrite(erWrite)
        } else if (erWrite) {
          this.emit('error', erWrite)
        }
      } else if (cbWrite && !erWrite && !cbDestroy) {
        const callback = cbWrite
        cbWrite = undefined
        callback()
      }
    })
  }

  function final (callback) {
    cbFinal = err => {
      if (err || !_final) {
        callback(err)
      } else {
        _final.call(this, callback)
      }
    }

    if (jobs <= 0) {
      cbFinal()
    }
  }

  function destroy (err, callback) {
    cbDestroy = _destroy ? _destroy.bind(this, err, callback) : callback

    if (jobs <= 0) {
      cbDestroy()
    }
  }

  return new Writable({
    ...options,
    write,
    writev: undefined,
    final,
    destroy
  })
}
