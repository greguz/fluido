import test from 'ava'
import { Readable, Transform, finished } from 'readable-stream'

import { readify } from '../index.js'

test.cb('readify', t => {
  t.plan(23)

  const stream = readify(
    [
      new Readable({
        objectMode: true,
        read () {
          t.pass()
          for (let i = 0; i <= 10; i++) {
            this.push(i)
          }
          this.push(null)
        }
      }),
      new Transform({
        objectMode: true,
        transform (chunk, encoding, callback) {
          t.pass()
          callback(null, Math.pow(2, chunk))
        }
      })
    ],
    { objectMode: true }
  )

  finished(stream, t.end)

  let x = 1
  stream.on('data', n => {
    t.is(n, x)
    x = x * 2
  })
})
