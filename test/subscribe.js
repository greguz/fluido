import test from 'ava'
import { subscribe } from '../index.js'

test('todo', t => {
  t.true(typeof subscribe === 'function')
  t.pass()
})
