import stream from 'readable-stream'

import { patchWritable } from './lib/concurrency.mjs'
import { handlePromise } from './lib/promise.mjs'
import { createReadMethod } from './lib/asyncRead.mjs'
import { inherits } from './lib/util.mjs'

export function Duplex (options) {
  if (!(this instanceof Duplex)) {
    return new Duplex(options)
  }
  stream.Duplex.call(this, options)
  if (options && options.asyncRead) {
    this._asyncRead = options.asyncRead
  }
  this._asyncRead = handlePromise(this._asyncRead)
  this._write = handlePromise(this._write)
  this._writev = handlePromise(this._writev)
  this._final = handlePromise(this._final)
  this._destroy = handlePromise(this._destroy)
  if (this._asyncRead) {
    this._read = createReadMethod(this._asyncRead)
  }
  if (options && options.concurrency >= 2) {
    patchWritable(this, options.concurrency)
  }
}

inherits(Duplex, stream.Duplex)
