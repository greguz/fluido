import test from 'ava'
import { Readable, Writable, Duplex, Transform } from 'readable-stream'

import {
  isReadable,
  isWritable,
  isStream,
  isDuplex,
  isReadableStrictly,
  isWritableStrictly
} from '../index.js'

const readable = new Readable()
const writable = new Writable()
const duplex = new Duplex()
const transform = new Transform()

test('isReadable', t => {
  t.false(isReadable())
  t.false(isReadable(undefined))
  t.false(isReadable(null))
  t.true(isReadable(readable))
  t.false(isReadable(writable))
  t.true(isReadable(duplex))
  t.true(isReadable(transform))
})

test('isWritable', t => {
  t.false(isWritable())
  t.false(isWritable(undefined))
  t.false(isWritable(null))
  t.false(isWritable(readable))
  t.true(isWritable(writable))
  t.true(isWritable(duplex))
  t.true(isWritable(transform))
})

test('isStream', t => {
  t.true(isStream(readable))
  t.true(isStream(writable))
  t.true(isStream(duplex))
  t.true(isStream(transform))
})

test('isDuplex', t => {
  t.false(isDuplex(readable))
  t.false(isDuplex(writable))
  t.true(isDuplex(duplex))
  t.true(isDuplex(transform))
})

test('isReadableStrictly', t => {
  t.true(isReadableStrictly(readable))
  t.false(isReadableStrictly(writable))
  t.false(isReadableStrictly(duplex))
  t.false(isReadableStrictly(transform))
})

test('isWritableStrictly', t => {
  t.false(isWritableStrictly(readable))
  t.true(isWritableStrictly(writable))
  t.false(isWritableStrictly(duplex))
  t.false(isWritableStrictly(transform))
})
