import test from 'ava'

import { Readable, Writable, finished, pipeline } from 'readable-stream'

import { merge } from './merge'

test.cb('merge', t => {
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

  finished(stream, t.end)

  stream.resume()

  stream.write({ dummy: true })
  stream.end()
})

test.cb('merge readables', t => {
  t.plan(11)

  const stream = merge(
    { objectMode: true },
    Readable.from(['la', 'vispa', 'teresa']),
    Readable.from(['avea', 'tra', 'l\'erbetta']),
    Readable.from(['a', 'volo', 'sorpresa']),
    Readable.from(['gentil', 'farfalletta'])
  )

  pipeline(
    stream,
    new Writable({
      highWaterMark: 2,
      objectMode: true,
      write (chunk, encoding, callback) {
        t.pass()
        setTimeout(callback, 10)
      }
    }),
    t.end
  )
})

test.cb('merge writables', t => {
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

  pipeline(
    Readable.from([42, 69]),
    stream,
    t.end
  )
})

test.cb('merge writables without writes', t => {
  pipeline(
    Readable.from([]),
    merge(
      { objectMode: true },
      new Writable({
        highWaterMark: 8,
        objectMode: true,
        write (chunk, encoding, callback) {
          t.pass()
          setTimeout(callback, 10)
        }
      })
    ),
    t.end
  )
})

test.cb('merge readables without reads', t => {
  pipeline(
    merge(
      { objectMode: true },
      Readable.from([])
    ),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        callback()
      }
    }),
    t.end
  )
})
