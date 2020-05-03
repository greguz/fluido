import stream from 'readable-stream'

import { patchTransform } from './internal/concurrency'
import { handlePromise } from './internal/promise'
import { inherits } from './internal/util'

export function Transform (options) {
  if (!(this instanceof Transform)) {
    return new Transform(options)
  }
  stream.Transform.call(this, options)
  this._transform = handlePromise(this._transform)
  this._flush = handlePromise(this._flush)
  this._destroy = handlePromise(this._destroy)
  if (options && options.concurrency > 0) {
    patchTransform(this, options.concurrency)
  }
}

inherits(Transform, stream.Transform)
