import test from 'ava'

import { fromCallback } from 'universalify'

import { handlePromise } from './promise.mjs'

test('handlePromise', async t => {
  const calculator = {
    value: 0,
    add (value, callback) {
      this.value = this.value + value
      callback(null, this.value)
    },
    async subtract (value) {
      this.value = this.value - value
      return this.value
    }
  }

  calculator.add = fromCallback(handlePromise(calculator.add))
  calculator.subtract = fromCallback(handlePromise(calculator.subtract))

  t.is(calculator.value, 0)

  const a = await calculator.add(16)
  t.is(a, 16)
  t.is(calculator.value, 16)

  const b = await calculator.subtract(8)
  t.is(b, 8)
  t.is(calculator.value, 8)
})
