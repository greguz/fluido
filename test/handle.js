import test from 'ava'
import { Writable } from 'readable-stream'

import { handle } from '../index.js'

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
    },
    destroy (err, callback) {
      if (t) {
        t.pass()
      }
      callback(err)
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

test('handle no callback', t => {
  t.throws(() => handle(), TypeError)
  t.throws(() => handle(buildWritable()), TypeError)
  t.throws(() => handle(buildWritable(), buildWritable()), TypeError)
})

test('handle empty', t => {
  t.throws(() => handle(() => {}), Error)
})

test.cb('handle single', t => {
  t.plan(3)

  const stream = buildWritable(t)

  handle(stream, err => {
    t.is(err.message, 'Premature close')
    t.end()
  })

  stream.write('something')
  stream.destroy()
})

test.cb('handle multiple', t => {
  t.plan(13)

  const streams = buildWritables(5, t)

  const killer = buildWritable(t)

  handle(...streams, killer, err => {
    t.is(err.message, 'Premature close')
    t.end()
  })

  for (const stream of streams) {
    stream.write('something')
  }
  killer.write('bye')
  killer.destroy()
})
