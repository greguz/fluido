import test from 'ava'
import { pump } from '../index.js'

test('todo', t => {
  t.true(typeof pump === 'function')
  t.pass()
})
