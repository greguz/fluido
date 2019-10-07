import test from 'ava'
import { Readable } from 'readable-stream'

import { subscribe, collect } from '../index.js'

test('collect buffer', async t => {
  const result = await subscribe(
    new Readable({
      objectMode: true,
      read () {
        this.push('F') // ive
        this.push('F') // inger
        this.push('D') // eath
        this.push('P') // unch
        this.push(null)
      }
    }),
    collect('buffer')
  )
  t.true(Buffer.isBuffer(result))
  t.is(result.toString('utf8'), 'FFDP')
})

test('collect string', async t => {
  const result = await subscribe(
    new Readable({
      objectMode: true,
      read () {
        this.push('S') // ystem
        this.push('O') // f
        this.push('A') //
        this.push('D') // own
        this.push(null)
      }
    }),
    collect('utf8')
  )
  t.is(result, 'SOAD')
})

test('collect raw', async t => {
  const result = await subscribe(
    new Readable({
      objectMode: true,
      read () {
        this.push('R') // ed
        this.push('H') // ot
        this.push('C') // hili
        this.push('P') // eppers
        this.push(null)
      }
    }),
    collect(false)
  )
  t.true(Array.isArray(result))
  t.is(result[0], 'R')
  t.is(result[1], 'H')
  t.is(result[2], 'C')
  t.is(result[3], 'P')
})
