import stream from 'readable-stream'

import { patchTransform } from './internal/concurrency.mjs'
import { handlePromise } from './internal/promise.mjs'

export class Transform extends stream.Transform {
  constructor (options) {
    super(options)

    this._destroy = handlePromise(this._destroy)
    this._construct = handlePromise(this._construct)
    this._transform = handlePromise(this._transform)
    this._flush = handlePromise(this._flush)

    const concurrency = Object(options).concurrency
    if (Number.isInteger(concurrency) && concurrency >= 2) {
      patchTransform(this, concurrency)
    }
  }
}
