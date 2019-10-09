import test from 'ava'
import { Writable } from 'readable-stream'

import { eos } from '../index.js'

function buildVoidWritable () {
  return new Writable({
    write (chunk, encoding, callback) {
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
  const stream = buildVoidWritable()

  const clean = eos(stream, () => t.fail())
  eos(stream, t.end)

  clean()

  stream.end()
})
