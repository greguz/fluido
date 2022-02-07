import stream from 'readable-stream'

import { createReadMethod } from './lib/asyncRead.mjs'
import { handlePromise } from './lib/promise.mjs'
import { inherits } from './lib/util.mjs'

export function Readable (options) {
  if (!(this instanceof Readable)) {
    return new Readable(options)
  }
  stream.Readable.call(this, options)
  if (options && options.asyncRead) {
    this._asyncRead = options.asyncRead
  }
  this._asyncRead = handlePromise(this._asyncRead)
  this._destroy = handlePromise(this._destroy)
  if (this._asyncRead) {
    this._read = createReadMethod(this._asyncRead)
  }
}

inherits(Readable, stream.Readable)

Readable.from = stream.Readable.from
