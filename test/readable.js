import test from 'ava'
import { Writable, pipeline } from 'stream'
import { readable } from '../src/index.js'

test.cb('readable callback mode', t => {
  let counter = 0

  const source = readable({
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
