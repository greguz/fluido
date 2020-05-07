import test from 'ava'

import { Duplex, Readable, Transform, Writable } from 'readable-stream'

import {
  isDuplex,
  isReadable,
  isReadableStrictly,
  isStream,
  isWritable,
  isWritableStrictly
} from './is'

test('isReadable', t => {
  t.true(isReadable(new Readable()))
  t.false(isReadable(new Writable()))
  t.true(isReadable(new Duplex()))
  t.true(isReadable(new Transform()))
})

test('isWritable', t => {
  t.false(isWritable(new Readable()))
  t.true(isWritable(new Writable()))
  t.true(isWritable(new Duplex()))
  t.true(isWritable(new Transform()))
})

test('isReadableStrictly', t => {
  t.true(isReadableStrictly(new Readable()))
  t.false(isReadableStrictly(new Writable()))
  t.false(isReadableStrictly(new Duplex()))
  t.false(isReadableStrictly(new Transform()))
})

test('isWritableStrictly', t => {
  t.false(isWritableStrictly(new Readable()))
  t.true(isWritableStrictly(new Writable()))
  t.false(isWritableStrictly(new Duplex()))
  t.false(isWritableStrictly(new Transform()))
})

test('isStream', t => {
  t.true(isStream(new Readable()))
  t.true(isStream(new Writable()))
  t.true(isStream(new Duplex()))
  t.true(isStream(new Transform()))
})

test('isDuplex', t => {
  t.false(isDuplex(new Readable()))
  t.false(isDuplex(new Writable()))
  t.true(isDuplex(new Duplex()))
  t.true(isDuplex(new Transform()))
})
