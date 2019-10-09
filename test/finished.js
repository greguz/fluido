import test from 'ava'
import { Writable } from 'readable-stream'

import { finished } from '../index.js'

function buildWritable (t) {
  return new Writable({
    write (chunk, encoding, callback) {
      if (t) {
        t.pass()
      }
      callback()
    },
    final (callback) {
      if (t) {
        t.pass()
      }
      callback()
    }
  })
}

function buildWritables (length, t) {
  const writables = []
  for (let i = 0; i < length; i++) {
    writables.push(buildWritable(t))
  }
  return writables
}

test('finished no callback', t => {
  t.throws(() => finished(), TypeError)
  t.throws(() => finished(buildWritable()), TypeError)
  t.throws(() => finished(buildWritable(), buildWritable()), TypeError)
})

test('finished empty', t => {
  t.throws(() => finished(() => {}), Error)
})

test.cb('finished single', t => {
  t.plan(2)
  const stream = buildWritable(t)
  finished(stream, t.end)
  stream.end('bye')
})

test.cb('finished multiple', t => {
  t.plan(10)

  const streams = buildWritables(5, t)

  finished(...streams, t.end)

  for (const stream of streams) {
    stream.end('bye')
  }
})

test.cb('finished clean single', t => {
  t.plan(2)

  const stream = buildWritable(t)

  const clean = finished(stream, t.fail)
  finished(stream, t.end)

  stream.write('something', () => {
    clean()
    stream.end()
  })
})

test.cb('finished clean multiple', t => {
  t.plan(5)

  const streams = buildWritables(5, t)

  const clean = finished(...streams, t.fail)
  finished(...streams, t.end)

  clean()
  for (const stream of streams) {
    stream.end()
  }
})
