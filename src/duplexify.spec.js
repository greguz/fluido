import test from 'ava'

import { Readable, Writable, pipeline } from 'readable-stream'
import { fromCallback } from 'universalify'

import { duplexify } from './duplexify'

const uPipeline = fromCallback(pipeline)

test('duplexify', async t => {
  const stream = duplexify()

  await uPipeline(
    new Readable({
      read () {
        this.push('something')
        this.push(null)
      }
    }),
    stream
  )

  await uPipeline(
    stream,
    new Writable()
  )

  t.pass()
})
