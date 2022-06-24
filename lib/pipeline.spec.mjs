import test from 'ava'

import { asCallback } from './callback.mjs'
import { pipeline } from './pipeline.mjs'
import { Readable } from './Readable.mjs'
import { Writable } from './Writable.mjs'

test('pipeline callback', async t => {
  const result = await new Promise((resolve, reject) => {
    let value = 0

    const readable = Readable.from([40, 2])
    const writable = new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.pass()
        value += chunk
        callback()
      }
    })

    const destination = pipeline(
      readable,
      writable,
      asCallback(err => {
        if (err) {
          reject(err)
        } else {
          resolve(value)
        }
      })
    )
    t.true(destination === writable)
  })

  t.is(result, 42)
})

test('pipeline promise', async t => {
  let value = 0

  const controller = new AbortController()
  const readable = Readable.from([40, 2])
  const writable = new Writable({
    objectMode: true,
    write (chunk, encoding, callback) {
      t.pass()
      value += chunk
      callback()
    }
  })

  const promise = pipeline(readable, writable, { signal: controller.signal })
  t.true(typeof Object(promise).then === 'function')
  await promise
  t.is(value, 42)
})
