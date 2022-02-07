import stream from 'readable-stream'

import { patchTransform } from './lib/concurrency.mjs'
import { handlePromise } from './lib/promise.mjs'
import { inherits } from './lib/util.mjs'

export function Transform (options) {
  if (!(this instanceof Transform)) {
    return new Transform(options)
  }
  stream.Transform.call(this, options)
  this._transform = handlePromise(this._transform)
  this._flush = handlePromise(this._flush)
  this._destroy = handlePromise(this._destroy)
  if (options && options.concurrency >= 2) {
    patchTransform(this, options.concurrency)
  }
}

inherits(Transform, stream.Transform)
