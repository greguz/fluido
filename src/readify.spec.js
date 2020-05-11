import test from 'ava'

import { PassThrough, Readable, Transform, Writable, pipeline } from 'readable-stream'
import { promisify } from 'util'

import { readify } from './readify'

const pPipeline = promisify(pipeline)

test.cb('readify', t => {
  t.plan(101)
  let counter = 0
  pipeline(
    readify(
      { objectMode: true },
      Readable.from(new Array(100).fill(1)),
      new PassThrough({ objectMode: true })
    ),
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
    }),
    t.end
  )
})

test.cb('readify destroy', t => {
  t.plan(3)

  pipeline(
    readify(
      new Readable({
        read () {
          this.push('42')
        },
        destroy (err, callback) {
          t.pass()
          callback(err)
        }
      }),
      new Transform({
        transform (chunk, encoding, callback) {
          callback(null, chunk)
        },
        destroy (err, callback) {
          t.pass()
          callback(err)
        }
      })
    ),
    new Writable({
      write (chunk, encoding, callback) {
        callback(new Error())
      },
      destroy (err, callback) {
        t.pass()
        callback(err)
      }
    }),
    () => {
      setImmediate(
        () => t.end()
      )
    }
  )
})

test('readify read error', async t => {
  await t.throwsAsync(
    pPipeline(
      readify(
        new Readable({
          read () {
            process.nextTick(
              () => this.emit('error', new Error('Failed on read'))
            )
          }
        }),
        new PassThrough()
      ),
      new Writable({
        objectMode: true,
        write () {
          t.fail()
        },
        final () {
          t.fail()
        }
      })
    ),
    { message: 'Failed on read' }
  )
})

test('readify transform error', async t => {
  await t.throwsAsync(
    pPipeline(
      readify(
        Readable.from(new Array(100).fill('42')),
        new Transform({
          transform (chunk, encoding, callback) {
            callback(new Error('Failed on transform'))
          }
        })
      ),
      new Writable({
        objectMode: true,
        write () {
          t.fail()
        },
        final () {
          t.fail()
        }
      })
    ),
    { message: 'Failed on transform' }
  )
})
