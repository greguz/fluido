import test from 'ava'
import { Duplex, Readable, Transform, Writable } from 'readable-stream'

import {
  isDuplexStream,
  isNodeStream,
  isReadableStream,
  isWritableStream
} from './is.mjs'

test('isNodeStream', t => {
  t.false(isNodeStream({}))
  t.true(isNodeStream(new Readable()))
  t.true(isNodeStream(new Writable()))
  t.true(isNodeStream(new Duplex()))
  t.true(isNodeStream(new Transform()))
})

test('isReadableStream', t => {
  t.false(isNodeStream({}))
  t.true(isReadableStream(new Readable()))
  t.false(isReadableStream(new Writable()))
  t.true(isReadableStream(new Duplex()))
  t.true(isReadableStream(new Transform()))
})

test('isWritableStream', t => {
  t.false(isNodeStream({}))
  t.false(isWritableStream(new Readable()))
  t.true(isWritableStream(new Writable()))
  t.true(isWritableStream(new Duplex()))
  t.true(isWritableStream(new Transform()))
})

test('isDuplexStream', t => {
  t.false(isNodeStream({}))
  t.false(isDuplexStream(new Readable()))
  t.false(isDuplexStream(new Writable()))
  t.true(isDuplexStream(new Duplex()))
  t.true(isDuplexStream(new Transform()))
})
