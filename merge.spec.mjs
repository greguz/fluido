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

  const stream = merge({ objectMode: true }, readable, writable)

  const promise = finished(stream)

  stream.resume()
  stream.write({ dummy: true })
  stream.end()

  return promise
})

test('merge readables', async t => {
  t.plan(11)

  const stream = merge(
    { objectMode: true },
    Readable.from(['la', 'vispa', 'teresa']),
    Readable.from(['avea', 'tra', 'l\'erbetta']),
    Readable.from(['a', 'volo', 'sorpresa']),
    Readable.from(['gentil', 'farfalletta'])
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
    { objectMode: true },
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
    })
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
      { objectMode: true },
      new Writable({
        write (chunk, encoding, callback) {
          callback(new Error('Written something'))
        }
      })
    )
  )
  t.pass()
})

test('merge readables without reads', async t => {
  await pipeline(
    merge(
      { objectMode: true },
      Readable.from([])
    ),
    new Writable({
      write (chunk, encoding, callback) {
        callback(new Error('Written something'))
      }
    })
  )
  t.pass()
})
