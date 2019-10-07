import test from 'ava'
import { Readable, Writable } from 'readable-stream'

import { pump } from '../index.js'

test.cb('pump callback', t => {
  const steps = 8
  let counter = 0
  pump(
    new Readable({
      objectMode: true,
      read () {
        for (let i = 0; i < steps; i++) {
          this.push({ i })
        }
        this.push(null)
      }
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        counter++
        callback()
      }
    }),
    err => {
      t.is(counter, steps)
      t.end(err)
    }
  )
})

test('pump promise', async t => {
  const steps = 8
  let counter = 0
  await pump(
    new Readable({
      objectMode: true,
      read () {
        for (let i = 0; i < steps; i++) {
          this.push({ i })
        }
        this.push(null)
      }
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        counter++
        callback()
      }
    })
  )
  t.is(counter, steps)
})
