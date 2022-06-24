import stream from 'readable-stream'

import { isCallback } from './callback.mjs'

export function pipeline (...args) {
  return isCallback(args[args.length - 1])
    ? stream.pipeline(...args)
    : stream.promises.pipeline(...args)
}
