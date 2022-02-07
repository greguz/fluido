import test from 'ava'

import { Readable, Writable } from 'readable-stream'

import { duplexify } from './duplexify.mjs'
import { pipeline } from './pipeline.mjs'

test('duplexify', async t => {
  const stream = duplexify()

  await pipeline(
    new Readable({
      read () {
        this.push('something')
        this.push(null)
      }
    }),
    stream
  )

  await pipeline(
    stream,
    new Writable()
  )

  t.pass()
})
