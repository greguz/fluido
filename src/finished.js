import handleInternal from './internal/handle'
import { isFunction, last } from './internal/utils'

export function finished (...args) {
  if (!isFunction(last(args))) {
    return new Promise((resolve, reject) =>
      finished(...args, err => (err ? reject(err) : resolve()))
    )
  }
  const callback = args.pop()
  handleInternal(args, false, callback)
}
