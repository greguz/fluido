import test from 'ava'
import { finished } from 'readable-stream'

import { readArray, collect, subscribe, transform } from '../index.js'

test.cb('read not array', t => {
  const stream = readArray(null)
  stream.resume()
  finished(stream, t.end)
})

test('read array', async t => {
  const result = await subscribe(
    readArray(
      ['a', 'b', 'c', 'd', 'e'],
      { highWaterMark: 2 }
    ),
    transform({
      objectMode: true,
      transform (chunk) {
        return new Promise(resolve => {
          setTimeout(() => resolve(chunk.toUpperCase()), 100)
        })
      }
    }),
    collect(false)
  )
  t.deepEqual(result, ['A', 'B', 'C', 'D', 'E'])
})
