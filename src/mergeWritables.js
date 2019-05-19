import { Writable } from 'stream'
import { handle } from './handle'

export function mergeWritables (targets, options) {
  let cbWrite
  let cbFinal
  let cbDestroy

  let waiting

  function write (chunk, encoding, callback) {
    if (waiting === undefined) {
      handle(...targets, err => {
        const callback = cbDestroy || cbFinal || cbWrite

        if (callback) {
          callback(err)
        } else {
          this.emit('error', err)
        }
      })

      waiting = 0
    }

    cbWrite = undefined

    waiting = targets.reduce((acc, target) => {
      const plugged = !target.write(chunk, encoding)

      if (plugged) {
        target.once('drain', () => {
          waiting--

          if (waiting <= 0) {
            callback()
          }
        })
      }

      return acc + (plugged ? 1 : 0)
    }, 0)

    if (waiting <= 0) {
      callback()
    } else {
      cbWrite = callback
    }
  }

  function final (callback) {
    cbFinal = callback

    for (const target of targets) {
      target.write(null)
    }
  }

  function destroy (err, callback) {
    cbDestroy = callback

    for (const target of targets) {
      target.write(err)
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
