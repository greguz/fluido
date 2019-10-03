import test from 'ava'
import finished from 'end-of-stream'

import { writable } from '../index.js'

test.cb('writable concurrent mode', t => {
  const concurrency = 10

  let writes = 0
  let active = 0

  const stream = writable({
    concurrency,
    write (chunk, encoding, callback) {
      writes++
      t.true(active >= 0 && active < concurrency)
      active++
      setTimeout(() => {
        active--
        callback()
      }, 10)
    },
    final (callback) {
      t.is(writes, 26)
      t.is(active, 0)
      callback()
    }
  })

  finished(stream, err => t.end(err))

  for (let i = 97; i <= 122; i++) {
    stream.write(String.fromCharCode(i))
  }
  stream.end()
})
