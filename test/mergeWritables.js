import test from 'ava'
import { Duplex, finished } from 'readable-stream'

import { mergeWritables } from '../index.js'

test.cb('mergeWritables', t => {
  t.plan(25)

  const targets = []
  for (let i = 0; i < 5; i++) {
    targets.push(
      new Duplex({
        objectMode: true,
        read () {
          t.fail()
          this.push(null)
        },
        write (chunk, encoding, callback) {
          t.pass()
          callback()
        }
      })
    )
  }

  const stream = mergeWritables(targets, { objectMode: true })

  finished(stream, t.end)

  for (let i = 0; i < 5; i++) {
    stream.write({ i })
  }
  stream.end()
})
