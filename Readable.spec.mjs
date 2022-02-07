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
  t.plan(23)

  const steps = 10
  let ri = 0
  let wi = 0

  await pipeline(
    new Readable({
      objectMode: true,
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
