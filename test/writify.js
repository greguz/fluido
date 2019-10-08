import test from 'ava'
import { Transform, Writable, finished } from 'readable-stream'

import { writify } from '../index.js'

test.cb('writify', t => {
  t.plan(22)

  let x = 1
  const stream = writify(
    [
      new Transform({
        objectMode: true,
        transform (chunk, encoding, callback) {
          t.pass()
          callback(null, Math.pow(2, chunk))
        }
      }),
      new Writable({
        objectMode: true,
        write (chunk, encoding, callback) {
          t.is(chunk, x)
          x = x * 2
          callback()
        }
      })
    ],
    { objectMode: true }
  )

  finished(stream, t.end)

  for (let i = 0; i <= 10; i++) {
    stream.write(i)
  }
  stream.end()
})
