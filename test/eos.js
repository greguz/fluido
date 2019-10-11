import test from 'ava'
import { Writable } from 'readable-stream'

import { eos } from '../index.js'

function buildVoidWritable (t) {
  return new Writable({
    write (chunk, encoding, callback) {
      if (t) {
        t.pass()
      }
      callback()
    },
    final (callback) {
      if (t) {
        t.pass()
      }
      callback()
    }
  })
}

test('eos no callback', t => {
  t.throws(() => eos(), TypeError)
  t.throws(() => eos(buildVoidWritable()), TypeError)
  t.throws(() => eos(buildVoidWritable(), {}), TypeError)
})

test.cb('eos clean', t => {
  t.plan(2)

  const stream = buildVoidWritable(t)

  const clean = eos(stream, () => t.fail())
  eos(stream, t.end)

  clean()

  stream.end('something')
})
