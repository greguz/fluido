import test from 'ava'
import { Duplex } from 'stream'
import finished from 'end-of-stream'

import { mergeReadables } from '../src/index.js'

function build (value) {
  return new Duplex({
    read () {
      this.push(value)
      this.push(null)
    },
    write (chunk, encoding, callback) {
      callback()
    }
  })
}

test.cb('mergeReadables', t => {
  const sources = [
    build('a'),
    build('b'),
    build('c'),
    build('d'),
    build('e'),
    build('f'),
    build('g')
  ]

  const stream = mergeReadables(sources)

  let counter = 0
  stream.addListener('data', () => (counter++))

  finished(stream, err => {
    if (!err) {
      t.is(counter, 7)
    }
    t.end(err)
  })
})
