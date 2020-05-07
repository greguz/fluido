import test from 'ava'

import { Readable, Transform } from 'readable-stream'

import { subscribe } from './subscribe'

test.cb('subscribe resolved callback', t => {
  const length = 100
  let accumulator = 0
  subscribe(
    Readable.from(new Array(length).fill(1)),
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

test('subscribe rejected callback', async t => {
  await t.throwsAsync(
    new Promise((resolve, reject) => {
      subscribe(
        new Readable({
          read () {
            process.nextTick(
              () => this.emit('error', new Error('STOP'))
            )
          }
        }),
        (err, res) => {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        }
      )
    }),
    { message: 'STOP' }
  )
})

test('subscribe resolved promise', async t => {
  const length = 100
  let accumulator = 0
  const result = await subscribe(
    Readable.from(new Array(length).fill(1)),
    new Transform({
      objectMode: true,
      transform (chunk, encoding, callback) {
        callback(null, accumulator += chunk)
      }
    })
  )
  t.is(result, length)
})

test('subscribe rejected promise', async t => {
  await t.throwsAsync(
    subscribe(
      new Readable({
        read () {
          process.nextTick(
            () => this.emit('error', new Error('STOP'))
          )
        }
      })
    ),
    { message: 'STOP' }
  )
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
