import test from 'ava'

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
