import test from 'ava'
import { Writable } from 'stream'
import pipeline from 'pump'
import finished from 'end-of-stream'

import { duplex } from '../src/index.js'

test.cb('duplex callback mode', t => {
  let counter = 0

  const source = duplex({
    objectMode: true,
    read (size, callback) {
      for (let i = 97; i <= 122; i++) {
        this.push(String.fromCharCode(i))
      }
      if (++counter >= 4) {
        this.push(null)
      }
      setTimeout(callback, 20)
    }
  })

  const target = new Writable({
    objectMode: true,
    write (chunk, encoding, callback) {
      setTimeout(callback, 50)
    }
  })

  pipeline(source, target, err => {
    if (!err) {
      t.is(counter, 4)
    }
    t.end(err)
  })
})

test.cb('duplex concurrent mode', t => {
  const concurrency = 10

  let writes = 0
  let active = 0

  const stream = duplex({
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

  finished(stream, { readable: false }, err => t.end(err))

  for (let i = 97; i <= 122; i++) {
    stream.write(String.fromCharCode(i))
  }
  stream.end()
})
