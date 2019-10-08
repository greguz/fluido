import test from 'ava'
import { Readable, Writable, finished } from 'readable-stream'

import { duplexify } from '../index.js'

test.cb('duplexify', t => {
  t.plan(11)

  const stream = duplexify(
    new Readable({
      objectMode: true,
      read () {
        t.pass()
        for (let i = 0; i < 5; i++) {
          this.push(i)
        }
        this.push(null)
      }
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.pass()
        callback()
      }
    }),
    { objectMode: true }
  )

  finished(stream, t.end)

  stream.addListener('data', () => t.pass())
  for (let i = 0; i < 5; i++) {
    stream.write(i)
  }
  stream.end()
})
