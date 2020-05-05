import test from 'ava'

import { Writable, pipeline } from 'readable-stream'

import { Readable } from './Readable'

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

test.cb('Readable asyncRead', t => {
  t.plan(23)

  const steps = 10
  let ri = 0
  let wi = 0

  pipeline(
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
    }),
    err => {
      if (!err) {
        t.is(ri, 10)
        t.is(wi, 10)
      }
      t.end(err)
    }
  )
})
