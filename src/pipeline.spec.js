import test from 'ava'

import { Readable, Transform, Writable } from 'readable-stream'

import { pipeline } from './pipeline'

test.cb('pipeline resolved callback', t => {
  t.plan(200)
  pipeline(
    Readable.from(new Array(100).fill(1)),
    new Transform({
      objectMode: true,
      transform (chunk, encoding, callback) {
        t.is(chunk, 1)
        callback(null, chunk + 41)
      }
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.is(chunk, 42)
        callback()
      }
    }),
    t.end
  )
})

test('pipeline rejected callback', async t => {
  await t.throwsAsync(
    new Promise((resolve, reject) => {
      pipeline(
        new Readable({
          read () {
            process.nextTick(
              () => this.emit('error', new Error('STOP'))
            )
          }
        }),
        new Writable(),
        err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    }),
    { message: 'STOP' }
  )
})

test('pipeline resolved promise', async t => {
  t.plan(200)
  await pipeline(
    Readable.from(new Array(100).fill(1)),
    new Transform({
      objectMode: true,
      transform (chunk, encoding, callback) {
        t.is(chunk, 1)
        callback(null, chunk + 41)
      }
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.is(chunk, 42)
        callback()
      }
    })
  )
})

test('pipeline rejected promise', async t => {
  await t.throwsAsync(
    pipeline(
      new Readable({
        read () {
          process.nextTick(
            () => this.emit('error', new Error('STOP'))
          )
        }
      }),
      new Writable()
    ),
    { message: 'STOP' }
  )
})
