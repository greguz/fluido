import { finished as eos } from 'stream'
import { isFunction, last } from './internal/utils'

function register (stream, callback) {
  const ticket = eos(stream, err => {
    ticket()
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
