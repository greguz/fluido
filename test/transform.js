import test from 'ava'
import finished from 'end-of-stream'

import { transform } from '../index.js'

test.cb('transform concurrent mode', t => {
  const concurrency = 10

  let writes = 0
  let active = 0

  const stream = transform({
    concurrency,
    transform (chunk, encoding, callback) {
      writes++
      t.true(active >= 0 && active < concurrency)
      active++
      setTimeout(() => {
        active--
        callback()
      }, 10)
    },
    flush (callback) {
      t.is(writes, 26)
      t.is(active, 0)
      callback()
    }
  })

  finished(stream, err => t.end(err))

  stream.resume()
  for (let i = 97; i <= 122; i++) {
    stream.write(String.fromCharCode(i))
  }
  stream.end()
})
