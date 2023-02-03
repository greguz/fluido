import stream from 'readable-stream'

import { patchWritable } from './internal/concurrency.mjs'
import { handlePromise } from './internal/promise.mjs'
import { createReadMethod } from './internal/asyncRead.mjs'

export class Duplex extends stream.Duplex {
  constructor (options) {
    super(options)

    if (typeof Object(options).asyncRead === 'function') {
      this._asyncRead = options.asyncRead
    }

    this._write = handlePromise(this._write)
    this._writev = handlePromise(this._writev)
    this._destroy = handlePromise(this._destroy)
    this._final = handlePromise(this._final)
    this._construct = handlePromise(this._construct)

    if (this._asyncRead) {
      this._read = createReadMethod(this._asyncRead)
    }

    const concurrency = Object(options).concurrency
    if (Number.isInteger(concurrency) && concurrency >= 2) {
      patchWritable(this, concurrency)
    }
  }
}
