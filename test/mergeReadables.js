import test from 'ava'
import { Duplex, finished } from 'readable-stream'

import { mergeReadables } from '../index.js'

test.cb('mergeReadables', t => {
  t.plan(16)

  const sources = []
  for (let i = 0; i < 8; i++) {
    sources.push(
      new Duplex({
        objectMode: true,
        read () {
          t.pass()
          this.push({ i })
          this.push(null)
        },
        write (chunk, encoding, callback) {
          t.fail()
          callback()
        }
      })
    )
  }

  const stream = mergeReadables(sources, { objectMode: true })

  stream.addListener('data', () => t.pass())

  finished(stream, t.end)
})
