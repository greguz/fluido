import test from 'ava'
import { Readable, Transform, Writable, pipeline } from 'stream'
import { readify } from '../src/index.js'

test.cb('readify', t => {
  let rc = 0
  const head = new Readable({
    highWaterMark: 10,
    read () {
      let flowing = true
      while (flowing && rc < 100) {
        flowing = this.push(rc.toString())
        rc++
      }
      if (rc >= 100) {
        this.push(null)
      }
    }
  })

  const body = new Transform({
    highWaterMark: 10,
    transform (chunk, encoding, callback) {
      callback(null, chunk)
    }
  })

  let wc = 0
  const tail = new Writable({
    highWaterMark: 10,
    write (chunk, encoding, callback) {
      wc++
      setTimeout(callback, 10)
    }
  })

  pipeline(readify([head, body]), tail, err => {
    if (!err) {
      t.is(rc, 100)
      t.is(wc, 100)
    }
    t.end(err)
  })
})
