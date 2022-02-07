import test from 'ava'

import { PassThrough, Readable, Transform, Writable } from 'readable-stream'

import { pipeline } from './pipeline.mjs'
import { writify } from './writify.mjs'

test('writify', async t => {
  t.plan(101)
  let counter = 0
  await pipeline(
    Readable.from(new Array(100).fill(1)),
    writify(
      { objectMode: true },
      new PassThrough({ objectMode: true }),
      new Writable({
        objectMode: true,
        write (chunk, encoding, callback) {
          t.is(chunk, 1)
          counter += chunk
          callback()
        },
        final (callback) {
          t.is(counter, 100)
          callback()
        }
      })
    )
  )
})

test('writify destroy', async t => {
  t.plan(4)
  await t.throwsAsync(
    () => pipeline(
      new Readable({
        read () {
          this.push('42')
        },
        destroy (err, callback) {
          t.pass()
          callback(err)
        }
      }),
      writify(
        new Transform({
          transform (chunk, encoding, callback) {
            callback(null, chunk)
          },
          destroy (err, callback) {
            t.pass()
            callback(err)
          }
        }),
        new Writable({
          write (chunk, encoding, callback) {
            callback(new Error("Pool's closed"))
          },
          destroy (err, callback) {
            t.pass()
            callback(err)
          }
        })
      )
    ),
    { message: "Pool's closed" }
  )
})

test('writify transform error', async t => {
  await t.throwsAsync(
    pipeline(
      Readable.from(new Array(100).fill('42')),
      writify(
        new Transform({
          transform (chunk, encoding, callback) {
            callback(new Error('Failed on transform'))
          }
        }),
        new Writable({
          write () {
            t.fail()
          }
        })
      )
    ),
    { message: 'Failed on transform' }
  )
})

test('writify write error', async t => {
  await t.throwsAsync(
    pipeline(
      Readable.from(new Array(100).fill('42')),
      writify(
        new PassThrough(),
        new Writable({
          write (chunk, encoding, callback) {
            callback(new Error('Failed on write'))
          }
        })
      )
    ),
    { message: 'Failed on write' }
  )
})

test('writify final error', async t => {
  await t.throwsAsync(
    pipeline(
      Readable.from(new Array(100).fill('42')),
      writify(
        new PassThrough(),
        new Writable({
          write (chunk, encoding, callback) {
            callback()
          },
          final (callback) {
            callback(new Error('Failed on final'))
          }
        })
      )
    ),
    { message: 'Failed on final' }
  )
})

test('writify without writes', async t => {
  await pipeline(
    Readable.from([]),
    writify(
      { objectMode: true },
      new PassThrough({ objectMode: true }),
      new Writable({
        objectMode: true,
        write (chunk, encoding, callback) {
          callback()
        }
      })
    )
  )
  t.pass()
})
