import test from 'ava'
import { Duplex } from 'stream'
import finished from 'end-of-stream'

import { mergeWritables } from '../index.js'

function build (onWrite) {
  return new Duplex({
    read () {
      this.push(null)
    },
    write (chunk, encoding, callback) {
      onWrite()
      callback()
    }
  })
}

test.cb('mergeWritables', t => {
  let counter = 0
  const callback = () => (counter++)
  const targets = [
    build(callback),
    build(callback),
    build(callback),
    build(callback),
    build(callback),
    build(callback),
    build(callback)
  ]

  const stream = mergeWritables(targets)

  finished(stream, err => {
    if (!err) {
      t.is(counter, 7 * 7)
    }
    t.end(err)
  })

  stream.write('a')
  stream.write('b')
  stream.write('c')
  stream.write('d')
  stream.write('e')
  stream.write('f')
  stream.write('g')
  stream.end()
})
