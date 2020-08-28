import test from 'ava'

import { Readable, Writable, finished } from 'readable-stream'

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
