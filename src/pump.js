import { pipeline } from 'stream'
import { isFunction, last } from './internal/utils'

export function pump (...args) {
  // Support both promise and callback signatures
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      pump(...args, err => (err ? reject(err) : resolve()))
    )
  }

  // Remove callback from arguments
  const callback = args.pop()

  // Ensure at least two streams
  if (args.length < 2) {
    callback(new Error('Expected at least two streams to pipe'))
    return
  }

  // Support duplex/transform stream as tail
  const tail = last(args)
  if (tail.readableFlowing === null) {
    tail.resume()
  }

  // Pump data
  pipeline(...args)
}
