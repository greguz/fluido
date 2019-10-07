import { isPromise } from './utils'

function handlePromise (promise, callback) {
  promise
    .then(result => callback(null, result))
    .catch(callback)
}

function supportPromise (read) {
  return function (size, callback) {
    handlePromise(read.call(this, size), callback)
  }
}

function once (fn) {
  let called = false
  return function (err, data) {
    if (called) return
    called = true
    fn(err, data)
  }
}

export default function wrapReadMethod (read) {
  let sync = false
  let reading = false

  return function (size) {
    if (sync || reading) {
      if (sync) {
        read.call(this, size)
      }
      return
    }
    reading = true

    const callback = once((err, data) => {
      if (err) {
        process.nextTick(() => this.emit('error', err))
        return
      }

      if (data !== undefined) {
        this.push(data)
      }

      if (this._readableState.ended) {
        return
      }

      reading = false
      if (this._readableState.length < this._readableState.highWaterMark) {
        process.nextTick(() => this._read(size))
      }
    })

    if (read.length >= 2) {
      if (isPromise(read.call(this, size, callback))) {
        callback(new Error('Overspecialized function'))
      }
      return
    }

    const out = read.call(this, size)
    if (isPromise(out)) {
      read = supportPromise(read)
      handlePromise(out, callback)
    } else {
      sync = true
      callback()
    }
  }
}
