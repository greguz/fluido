import test from 'ava'

import { PassThrough, Readable, Transform, Writable, pipeline } from 'readable-stream'
import { promisify } from 'util'

import { writify } from './writify'

const pPipeline = promisify(pipeline)

test.cb('writify', t => {
  t.plan(101)
  let counter = 0
  pipeline(
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
    ),
    t.end
  )
})

test.cb('writify destroy', t => {
  t.plan(3)

  pipeline(
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
          callback(new Error())
        },
        destroy (err, callback) {
          t.pass()
          callback(err)
        }
      })
    ),
    () => {
      setImmediate(
        () => t.end()
      )
    }
  )
})

test('writify transform error', async t => {
  await t.throwsAsync(
    pPipeline(
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
    pPipeline(
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
    pPipeline(
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
