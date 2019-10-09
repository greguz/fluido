import handleInternal from './internal/handle'
import { isFunction, last } from './internal/utils'

export function finished (...args) {
  if (!isFunction(last(args))) {
    throw new TypeError('Expected callback')
  }
  if (args.length <= 1) {
    throw new Error('Expected at least one stream')
  }
  return handleInternal(args, false, args.pop())
}
