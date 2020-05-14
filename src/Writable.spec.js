import test from 'ava'

import { Readable, pipeline } from 'readable-stream'
import { fromCallback } from 'universalify'

import { Writable } from './Writable'

const uDelay = fromCallback(
  function delay (ms, callback) {
    setTimeout(callback, ms, null)
  }
)

const uPipeline = fromCallback(pipeline)

test.cb('Writable write callback', t => {
  t.plan(100)
  uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.is(chunk, 1)
        uDelay(10, callback)
      }
    }),
    t.end
  )
})

test('Writable write promise', async t => {
  t.plan(100)
  await uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Writable({
      objectMode: true,
      async write (chunk) {
        t.is(chunk, 1)
        await uDelay(10)
      }
    })
  )
})

test.cb('Writable writev callback', t => {
  t.plan(100)
  uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.is(chunk, 1)
        uDelay(10, callback)
      },
      writev (items, callback) {
        for (const item of items) {
          t.is(item.chunk, 1)
        }
        uDelay(10, callback)
      }
    }),
    t.end
  )
})

test('Writable writev promise', async t => {
  t.plan(100)
  await uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Writable({
      objectMode: true,
      async write (chunk) {
        t.is(chunk, 1)
        await uDelay(10)
      },
      async writev (items) {
        for (const item of items) {
          t.is(item.chunk, 1)
        }
        await uDelay(10)
      }
    })
  )
})

test.cb('Writable final callback', t => {
  t.plan(1)
  let count = 0
  uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        count += chunk
        callback()
      },
      final (callback) {
        t.is(count, 100)
        uDelay(10, callback)
      }
    }),
    t.end
  )
})

test('Writable final promise', async t => {
  t.plan(1)
  let count = 0
  await uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Writable({
      objectMode: true,
      async write (chunk) {
        count += chunk
      },
      async final () {
        t.is(count, 100)
        await uDelay(10)
      }
    })
  )
})

test('Writable concurrency', async t => {
  t.plan(100)

  const concurrency = 4
  const items = 100

  let jobs = 0
  let index = 0

  await uPipeline(
    Readable.from(new Array(items).fill(1)),
    new Writable({
      concurrency,
      objectMode: true,
      async write () {
        if (jobs < 0 || jobs >= concurrency) {
          t.fail()
        }

        const i = index++
        if (i < concurrency) {
          t.is(jobs, i)
        } else {
          t.pass()
        }

        jobs++
        await uDelay(10)
        jobs--
      }
    })
  )
})
