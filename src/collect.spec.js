import test from 'ava'

import { Readable, Writable, pipeline } from 'readable-stream'

import { collect } from './collect'

function pump (source, target) {
  return new Promise((resolve, reject) => {
    let result
    pipeline(
      source,
      collect(target),
      new Writable({
        objectMode: true,
        write (chunk, encoding, callback) {
          result = chunk
          callback()
        }
      }),
      err => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    )
  })
}

test('collect buffer', async t => {
  const result = await pump(
    new Readable({
      read () {
        this.push('Harry Potter')
        this.push(', ')
        this.push('Ron Weasley')
        this.push(', ')
        this.push('Hermione Granger')
        this.push(null)
      }
    }),
    'buffer'
  )
  t.true(Buffer.isBuffer(result))
  t.is(
    result.toString(),
    'Harry Potter, Ron Weasley, Hermione Granger'
  )
})

test('collect string', async t => {
  const result = await pump(
    new Readable({
      read () {
        this.push(Buffer.from([0xf0, 0x9f, 0x98, 0xba]), 'utf8')
        this.push('🌈')
        this.push(null)
      }
    }),
    'string'
  )
  t.is(result, '😺🌈')
})

test('collect array', async t => {
  const result = await pump(
    new Readable({
      objectMode: true,
      read () {
        this.push('Harry Potter')
        this.push('Ron Weasley')
        this.push('Hermione Granger')
        this.push(null)
      }
    }),
    false
  )
  t.deepEqual(result, [
    'Harry Potter',
    'Ron Weasley',
    'Hermione Granger'
  ])
})
