import stream from 'readable-stream'

import { createReadMethod } from './internal/asyncRead.mjs'
import { handlePromise } from './internal/promise.mjs'

export class Readable extends stream.Readable {
  static from (...args) {
    return stream.Readable.from(...args)
  }

  static fromWeb (...args) {
    return stream.Readable.fromWeb(...args)
  }

  static isDisturbed (...args) {
    return stream.Readable.isDisturbed(...args)
  }

  static toWeb (...args) {
    return stream.Readable.toWeb(...args)
  }

  constructor (options) {
    super(options)

    if (typeof Object(options).asyncRead === 'function') {
      this._asyncRead = options.asyncRead
    }

    this._destroy = handlePromise(this._destroy)
    this._construct = handlePromise(this._construct)

    if (this._asyncRead) {
      this._read = createReadMethod(this._asyncRead)
    }
  }
}
