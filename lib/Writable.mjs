import stream from 'readable-stream'

import { patchWritable } from './internal/concurrency.mjs'
import { handlePromise } from './internal/promise.mjs'

export class Writable extends stream.Writable {
  constructor (options) {
    super(options)

    this._write = handlePromise(this._write)
    this._writev = handlePromise(this._writev)
    this._destroy = handlePromise(this._destroy)
    this._final = handlePromise(this._final)
    this._construct = handlePromise(this._construct)

    const concurrency = Object(options).concurrency
    if (Number.isInteger(concurrency) && concurrency >= 2) {
      patchWritable(this, concurrency)
    }
  }
}
