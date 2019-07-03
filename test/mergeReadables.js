import test from 'ava'
import { Duplex, finished } from 'stream'
import { mergeReadables } from '../index.js'

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
  stream.on('data', () => (counter++))

  finished(stream, err => {
    if (!err) {
      t.is(counter, 7)
    }
    t.end(err)
  })
})
