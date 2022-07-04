import test from 'ava'
import { Writable } from 'readable-stream'

import { pipeline } from './pipeline.mjs'
import { Readable } from './Readable.mjs'

test('Readable read', t => {
  t.plan(21)
  const steps = 10
  let index = 0
  const stream = new Readable({
    objectMode: true,
    read () {
      t.pass()
      this.push(index < steps ? index++ : null)
    }
  })
  let value = stream.read()
  while (value !== null) {
    t.true(typeof value === 'number')
    value = stream.read()
  }
})

test('Readable asyncRead', async t => {
  t.plan(24)

  const steps = 10
  let ri = 0
  let wi = 0

  await pipeline(
    new Readable({
      objectMode: true,
      async construct () {
        t.pass()
      },
      asyncRead (size, callback) {
        t.pass()
        setTimeout(
          () => callback(null, ri < steps ? ri++ : null),
          10
        )
      }
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.is(chunk, wi++)
        callback()
      }
    })
  )

  t.is(ri, 10)
  t.is(wi, 10)
})

test('Readable asyncRead 2', async t => {
  t.plan(23)

  const steps = 10
  let ri = 0
  let wi = 0

  await pipeline(
    new Readable({
      objectMode: true,
      asyncRead (size) {
        return new Promise(resolve => {
          t.pass()

          setTimeout(
            () => {
              this.push(ri < steps ? ri++ : null)
              resolve()
            },
            10
          )
        })
      }
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.is(chunk, wi++)
        callback()
      }
    })
  )

  t.is(ri, 10)
  t.is(wi, 10)
})

test('Readable _asyncRead protection', t => {
  class CustomReadable extends Readable {
    _read () {
      this._destroy(new Error('My custom _read method'))
    }
  }
  t.throws(
    () => new CustomReadable({ asyncRead () {} }),
    { message: 'The _read method cannot be defined along with the _asyncRead method' }
  )
})
