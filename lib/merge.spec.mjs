import test from 'ava'
import { Readable, Writable } from 'readable-stream'

import { finished } from './finished.mjs'
import { merge } from './merge.mjs'
import { pipeline } from './pipeline.mjs'

test('merge', async t => {
  t.plan(2)

  const readable = new Readable({
    objectMode: true,
    read () {
      t.pass()
      this.push(null)
    }
  })

  const writable = new Writable({
    objectMode: true,
    write (chunk, encoding, callback) {
      t.pass()
      callback()
    }
  })

  const stream = merge(readable, writable, { objectMode: true })

  const promise = finished(stream)

  stream.resume()
  stream.write({ dummy: true })
  stream.end()

  return promise
})

test('merge readables', async t => {
  t.plan(11)

  const stream = merge(
    Readable.from(['la', 'vispa', 'teresa']),
    Readable.from(['avea', 'tra', 'l\'erbetta']),
    Readable.from(['a', 'volo', 'sorpresa']),
    Readable.from(['gentil', 'farfalletta']),
    { objectMode: true }
  )

  await pipeline(
    stream,
    new Writable({
      highWaterMark: 2,
      objectMode: true,
      write (chunk, encoding, callback) {
        t.pass()
        setTimeout(callback, 10)
      }
    })
  )
})

test('merge writables', async t => {
  t.plan(6)

  const stream = merge(
    new Writable({
      highWaterMark: 2,
      objectMode: true,
      write (chunk, encoding, callback) {
        t.pass()
        setTimeout(callback, 10)
      }
    }),
    new Writable({
      highWaterMark: 4,
      objectMode: true,
      write (chunk, encoding, callback) {
        t.pass()
        setTimeout(callback, 10)
      }
    }),
    new Writable({
      highWaterMark: 8,
      objectMode: true,
      write (chunk, encoding, callback) {
        t.pass()
        setTimeout(callback, 10)
      }
    }),
    { objectMode: true }
  )

  await pipeline(
    Readable.from([42, 69]),
    stream
  )
})

test('merge writables without writes', async t => {
  await pipeline(
    Readable.from([]),
    merge(
      new Writable({
        write (chunk, encoding, callback) {
          callback(new Error('Written something'))
        }
      }),
      { objectMode: true }
    )
  )
  t.pass()
})

test('merge readables without reads', async t => {
  await pipeline(
    merge(
      Readable.from([]),
      { objectMode: true }
    ),
    new Writable({
      write (chunk, encoding, callback) {
        callback(new Error('Written something'))
      }
    })
  )
  t.pass()
})
