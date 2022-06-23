import stream from 'readable-stream'

import { isCallback } from './callback.mjs'

export function pipeline (...args) {
  return args.some(isCallback)
    ? stream.pipeline(...args)
    : stream.promises.pipeline(...args)
}
