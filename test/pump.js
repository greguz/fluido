import test from 'ava'
import { Readable, Writable } from 'stream'
import { pump } from '../index.js'

test.cb('pump', t => {
  let counter = 0

  const source = new Readable({
    read () {
      this.push('a')
      this.push('b')
      this.push('c')
      this.push('d')
      this.push('e')
      this.push('f')
      this.push('g')
      this.push(null)
    }
  })

  const target = new Writable({
    write (chunk, encoding, callback) {
      counter++
      callback()
    }
  })

  pump(source, target, err => {
    if (!err) {
      t.is(counter, 7)
    }
    t.end(err)
  })
})

test('pump promise', async t => {
  let counter = 0

  const source = new Readable({
    read () {
      this.push('a')
      this.push('b')
      this.push('c')
      this.push('d')
      this.push('e')
      this.push('f')
      this.push('g')
      this.push(null)
    }
  })

  const target = new Writable({
    write (chunk, encoding, callback) {
      counter++
      callback()
    }
  })

  await pump(source, target)

  t.is(counter, 7)
})
