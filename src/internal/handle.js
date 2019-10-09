import { eos } from '../eos'

import destroyStream from './destroy'
import { noop } from './utils'

function readStream (entry) {
  return Array.isArray(entry) ? entry[0] : entry
}

function readOptions (entry) {
  return Array.isArray(entry) ? entry[1] : {}
}

function toDestroyer (stream) {
  let destroyed = false
  return function destroyer (err) {
    if (!stream.__closed__ && !destroyed) {
      destroyed = true
      destroyStream(stream, err)
    }
  }
}

function compose (a, b) {
  return function composed (arg) {
    a(arg)
    b(arg)
  }
}

function buildDestroyer (entries) {
  return entries.map(readStream).map(toDestroyer).reduce(compose)
}

export default function handleInternal (entries, destroyOnError, callback) {
  const destroy = destroyOnError ? buildDestroyer(entries) : noop

  let count = entries.length
  let error = null

  const end = err => {
    error = error || err
    if (error) {
      destroy(error)
    }
    if (--count < 1) {
      callback(error)
    }
  }

  return entries
    .map(entry => {
      const stream = readStream(entry)
      const options = readOptions(entry)

      return eos(stream, options, err => {
        stream.__closed__ = true
        end(err)
      })
    })
    .reduce(compose)
}
