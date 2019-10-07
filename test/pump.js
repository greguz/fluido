import test from 'ava'
import { Readable, Writable } from 'readable-stream'

import { pump } from '../index.js'

test.cb('pump callback', t => {
  t.plan(9)
  pump(
    new Readable({
      objectMode: true,
      read () {
        t.pass()
        for (let i = 0; i < 8; i++) {
          this.push({ i })
        }
        this.push(null)
      }
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.true(typeof chunk.i === 'number')
        callback()
      }
    }),
    t.end
  )
})

test('pump promise', async t => {
  t.plan(9)
  await pump(
    new Readable({
      objectMode: true,
      read () {
        t.pass()
        for (let i = 0; i < 8; i++) {
          this.push({ i })
        }
        this.push(null)
      }
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.true(typeof chunk.i === 'number')
        callback()
      }
    })
  )
})
