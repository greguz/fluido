import stream from 'readable-stream'

import { createReadMethod } from './internal/asyncRead'
import { handlePromise } from './internal/promise'
import { inherits } from './internal/util'

export function Readable (options) {
  if (!(this instanceof Readable)) {
    return new Readable(options)
  }
  stream.Readable.call(this, options)
  this._destroy = handlePromise(this._destroy)
  const asyncRead = (options ? options.asyncRead : null) || this._asyncRead
  if (asyncRead) {
    this._read = createReadMethod(asyncRead)
  }
}

inherits(Readable, stream.Readable)

Readable.from = stream.Readable.from
