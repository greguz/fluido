import test from 'ava'
import { finished } from 'readable-stream'

import { readable } from '../index.js'

test.cb('read sync', t => {
  const highWaterMark = 3

  let calls = 0

  const stream = readable({
    objectMode: true,
    highWaterMark,
    read () {
      calls++
      this.push({})
    }
  })

  stream.read()

  setImmediate(() => {
    t.is(calls >= highWaterMark, true)
    t.is(stream._readableState.length, calls - 1)
    t.end()
  })
})

test.cb('read callback', t => {
  const highWaterMark = 3
  const timeStep = 20

  let reading = false
  let calls = 0

  const stream = readable({
    objectMode: true,
    highWaterMark,
    read (_size, callback) {
      calls++

      if (reading) {
        callback(new Error('Unexpected concurrent read'))
        return
      }

      reading = true
      setTimeout(
        () => {
          reading = false
          callback(null, {})
        },
        timeStep
      )
    }
  })

  stream.read()

  setTimeout(
    () => {
      t.is(calls >= highWaterMark, true)
      t.is(stream._readableState.length, calls)
      t.end()
    },
    timeStep * highWaterMark + timeStep
  )
})

test.cb('read promise', t => {
  const highWaterMark = 3
  const timeStep = 20

  let reading = false
  let calls = 0

  const stream = readable({
    objectMode: true,
    highWaterMark,
    read () {
      calls++
      return new Promise((resolve, reject) => {
        if (reading) {
          reject(new Error('Unexpected concurrent read'))
          return
        }
        reading = true
        setTimeout(
          () => {
            reading = false
            resolve({})
          },
          timeStep
        )
      })
    }
  })

  stream.read()

  setTimeout(
    () => {
      t.is(calls >= highWaterMark, true)
      t.is(stream._readableState.length, calls)
      t.end()
    },
    timeStep * highWaterMark + timeStep
  )
})

test.cb('destroy callback', t => {
  let destroying = false

  const stream = readable({
    objectMode: true,
    destroy () {
      destroying = true
      return new Promise(resolve => {
        setTimeout(
          () => {
            destroying = false
            resolve()
          },
          100
        )
      })
    }
  })

  finished(stream, err => {
    t.is(err.message, 'Premature close')
    t.false(destroying)
    t.end()
  })
  t.false(destroying)
  stream.destroy()
  t.true(destroying)
})
