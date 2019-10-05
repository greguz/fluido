import handleInternal from './internal/handle'
import { isFunction, last } from './internal/utils'

export function handle (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      handle(...args, err => (err ? reject(err) : resolve()))
    )
  }
  const callback = args.pop()
  handleInternal(args, true, callback)
}
