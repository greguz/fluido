import stream from 'readable-stream'

import { createReadMethod } from './internal/asyncRead.mjs'
import { handlePromise } from './internal/promise.mjs'

export class Readable extends stream.Readable {
  constructor (options) {
    super(options)

    if (typeof Object(options).asyncRead === 'function') {
      this._asyncRead = options.asyncRead
    }

    this._destroy = handlePromise(this._destroy)
    this._construct = handlePromise(this._construct)

    if (this._asyncRead) {
      if (this._read !== Readable.prototype._read) {
        throw new Error('The _read method cannot be defined along with the _asyncRead method')
      }
      this._read = createReadMethod(this._asyncRead)
    }
  }
}
