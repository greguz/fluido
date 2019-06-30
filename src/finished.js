import { finished as eos } from 'stream'
import { isFunction, last, noop } from './internal/utils'

function register (stream, callback) {
  const clean = eos(stream, err => {
    // Prevent future error throwing
    stream.on('error', noop)
    // Clean used listeners
    clean()
    // All done
    callback(err)
  })
}

export function finished (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      finished(...args, err => (err ? reject(err) : resolve()))
    )
  }

  const callback = args.pop()

  if (args.length <= 0) {
    process.nextTick(callback, null)
    return
  } else if (args.length === 1) {
    register(args[0], callback)
    return
  }

  let ended = 0
  let error = null

  const end = err => {
    ended++
    error = error || err

    if (ended >= args.length) {
      callback(error)
    }
  }

  for (const stream of args) {
    register(stream, end)
  }
}
