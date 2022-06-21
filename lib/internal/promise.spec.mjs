import test from 'ava'
import { promisify } from 'util'

import { handlePromise } from './promise.mjs'

test('handlePromise', async t => {
  const a = promisify(
    handlePromise(
      (value, callback) => callback(null, value * 2)
    )
  )
  const b = await a(4)
  t.is(b, 8)

  const c = promisify(
    handlePromise(
      (value) => Promise.resolve(value * 2)
    )
  )
  const d = await c(8)
  t.is(d, 16)
})
