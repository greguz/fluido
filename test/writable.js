import test from 'ava'
import eos from 'end-of-stream'

import { writable } from '../index.js'

test.cb('writable concurrent', t => {
  const concurrency = 3

  let writes = 0
  let active = 0

  const stream = writable({
    objectMode: true,
    concurrency,
    write (chunk, encoding, callback) {
      writes++
      active++
      t.is(active >= 0 && active <= concurrency, true)
      setTimeout(
        () => {
          active--
          callback()
        },
        10
      )
    },
    final (callback) {
      t.is(writes, concurrency * 2)
      t.is(active, 0)
      callback()
    }
  })

  eos(stream, t.end)

  for (let i = 0; i < (concurrency * 2); i++) {
    stream.write({ i })
  }
  t.is(active, concurrency)
  t.end()
})
