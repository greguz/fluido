import stream from 'readable-stream'

import { patchWritable } from './internal/concurrency'
import { handlePromise } from './internal/promise'
import { createReadMethod } from './internal/asyncRead'
import { inherits } from './internal/util'

export function Duplex (options) {
  if (!(this instanceof Duplex)) {
    return new Duplex(options)
  }
  stream.Duplex.call(this, options)
  this._write = handlePromise(this._write)
  this._writev = handlePromise(this._writev)
  this._final = handlePromise(this._final)
  this._destroy = handlePromise(this._destroy)
  const asyncRead = (options ? options.asyncRead : null) || this._asyncRead
  if (asyncRead) {
    this._read = createReadMethod(asyncRead)
  }
  if (options && options.concurrency > 0) {
    patchWritable(this, options.concurrency)
  }
}

inherits(Duplex, stream.Duplex)
