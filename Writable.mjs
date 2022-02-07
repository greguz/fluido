import stream from 'readable-stream'

import { patchWritable } from './lib/concurrency.mjs'
import { handlePromise } from './lib/promise.mjs'
import { inherits } from './lib/util.mjs'

export function Writable (options) {
  if (!(this instanceof Writable)) {
    return new Writable(options)
  }
  stream.Writable.call(this, options)
  this._write = handlePromise(this._write)
  this._writev = handlePromise(this._writev)
  this._final = handlePromise(this._final)
  this._destroy = handlePromise(this._destroy)
  if (options && options.concurrency >= 2) {
    patchWritable(this, options.concurrency)
  }
}

inherits(Writable, stream.Writable)
