import test from 'ava'

import { asCallback, isCallback } from './callback.mjs'

test('callback', t => {
  t.throws(() => asCallback(null))
  const fn = () => {}
  t.false(isCallback(fn))
  const c = asCallback(fn)
  t.true(isCallback(c))
})
