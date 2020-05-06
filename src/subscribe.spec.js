import test from 'ava'

import { Readable, Transform } from 'readable-stream'

import { subscribe } from './subscribe'

test.cb('subscribe callback', t => {
  const length = 100
  const array = new Array(length).fill(1)
  let accumulator = 0
  subscribe(
    Readable.from(array),
    new Transform({
      objectMode: true,
      transform (chunk, encoding, callback) {
        callback(null, accumulator += chunk)
      }
    }),
    (err, res) => {
      if (!err) {
        t.is(res, length)
      }
      t.end(err)
    }
  )
})

test('subscribe promise', async t => {
  const length = 100
  const array = new Array(length).fill(1)
  let accumulator = 0
  const result = await subscribe(
    Readable.from(array),
    new Transform({
      objectMode: true,
      transform (chunk, encoding, callback) {
        callback(null, accumulator += chunk)
      }
    })
  )
  t.is(result, length)
})

test('subscribe null', async t => {
  const result = await subscribe(
    Readable.from([]),
    new Transform({
      objectMode: true,
      transform () {
        t.fail()
      }
    })
  )
  t.is(result, null)
})
