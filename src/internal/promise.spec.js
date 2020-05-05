import test from 'ava'

import { handlePromise } from './promise'

test.cb('handlePromise 1', t => {
  function multiply (value, callback) {
    setTimeout(
      () => callback(null, this.value * value),
      10
    )
  }

  const object = {
    value: 2,
    multiply: handlePromise(multiply)
  }

  object.multiply(2, (err, res) => {
    t.is(res, 4)
    t.end(err)
  })
})

test.cb('handlePromise 2', t => {
  function multiply (value) {
    return new Promise(resolve => {
      setTimeout(
        () => resolve(this.value * value),
        10
      )
    })
  }

  const object = {
    value: 2,
    multiply: handlePromise(multiply)
  }

  object.multiply(2, (err, res) => {
    t.is(res, 4)
    t.end(err)
  })
})

test.cb('handlePromise 3', t => {
  function multiply (value, callback) {
    return new Promise(resolve => {
      setTimeout(
        () => {
          callback(null, this.value * value)
          resolve(this.value * value)
        },
        10
      )
    })
  }

  const object = {
    value: 2,
    multiply: handlePromise(multiply)
  }

  let called = false
  object.multiply(2, (err, res) => {
    if (err) {
      t.fail()
    }
    t.is(res, 4)
    if (called) {
      t.end()
    } else {
      called = true
    }
  })
})
