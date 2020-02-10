import test from 'ava'
import { Readable, Transform } from 'readable-stream'

import { subscribe } from '../index.js'

test.cb('subscribe empty callback', t => {
  subscribe(
    (err, result) => {
      t.is(err.message, 'Expected at least one readable stream')
      t.is(result, undefined)
      t.end()
    }
  )
})

test('subscribe empty promise', async t => {
  await t.throwsAsync(
    () => subscribe(),
    { message: 'Expected at least one readable stream' }
  )
})

test.cb('subscribe stream callback', t => {
  subscribe(
    new Readable({
      objectMode: true,
      read () {
        this.push({ i: 0 })
        this.push({ i: 1 })
        this.push({ i: 2 })
        this.push(null)
      }
    }),
    (err, result) => {
      t.is(result.i, 2)
      t.end(err)
    }
  )
})

test('subscribe stream promise', async t => {
  const result = await subscribe(
    new Readable({
      objectMode: true,
      read () {
        this.push({ i: 0 })
        this.push({ i: 1 })
        this.push({ i: 2 })
        this.push(null)
      }
    })
  )
  t.is(result.i, 2)
})

test.cb('subscribe pipeline callback', t => {
  subscribe(
    new Readable({
      objectMode: true,
      read () {
        this.push({ i: 0 })
        this.push({ i: 1 })
        this.push({ i: 2 })
        this.push(null)
      }
    }),
    new Transform({
      objectMode: true,
      transform (chunk, encoding, callback) {
        callback(null, {
          i: chunk.i * 2
        })
      }
    }),
    (err, result) => {
      t.is(result.i, 4)
      t.end(err)
    }
  )
})

test('subscribe pipeline promise', async t => {
  const result = await subscribe(
    new Readable({
      objectMode: true,
      read () {
        this.push({ i: 0 })
        this.push({ i: 1 })
        this.push({ i: 2 })
        this.push(null)
      }
    }),
    new Transform({
      objectMode: true,
      transform (chunk, encoding, callback) {
        callback(null, {
          i: chunk.i * 2
        })
      }
    })
  )
  t.is(result.i, 4)
})
