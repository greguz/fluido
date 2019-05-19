import test from 'ava'
import { Readable, Writable, Duplex, Transform } from 'stream'
import {
  isReadable,
  isWritable,
  isDuplex,
  isTransform,
  isReadableStrictly,
  isWritableStrictly,
  isDuplexStrictly,
  isStream
} from '../index.js'

const readable = new Readable()
const writable = new Writable()
const duplex = new Duplex()
const transform = new Transform()

test('isReadable', t => {
  t.true(isReadable(readable))
  t.false(isReadable(writable))
  t.true(isReadable(duplex))
  t.true(isReadable(transform))
  t.pass()
})

test('isWritable', t => {
  t.false(isWritable(readable))
  t.true(isWritable(writable))
  t.true(isWritable(duplex))
  t.true(isWritable(transform))
  t.pass()
})

test('isDuplex', t => {
  t.false(isDuplex(readable))
  t.false(isDuplex(writable))
  t.true(isDuplex(duplex))
  t.true(isDuplex(transform))
  t.pass()
})

test('isTransform', t => {
  t.false(isTransform(readable))
  t.false(isTransform(writable))
  t.false(isTransform(duplex))
  t.true(isTransform(transform))
  t.pass()
})

test('isReadableStrictly', t => {
  t.true(isReadableStrictly(readable))
  t.false(isReadableStrictly(writable))
  t.false(isReadableStrictly(duplex))
  t.false(isReadableStrictly(transform))
  t.pass()
})

test('isWritableStrictly', t => {
  t.false(isWritableStrictly(readable))
  t.true(isWritableStrictly(writable))
  t.false(isWritableStrictly(duplex))
  t.false(isWritableStrictly(transform))
  t.pass()
})

test('isDuplexStrictly', t => {
  t.false(isDuplexStrictly(readable))
  t.false(isDuplexStrictly(writable))
  t.true(isDuplexStrictly(duplex))
  t.false(isDuplexStrictly(transform))
  t.pass()
})

test('isStream', t => {
  t.true(isStream(readable))
  t.true(isStream(writable))
  t.true(isStream(duplex))
  t.true(isStream(transform))
  t.pass()
})
