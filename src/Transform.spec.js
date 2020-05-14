import test from 'ava'

import { Readable, Writable, pipeline } from 'readable-stream'
import { fromCallback } from 'universalify'

import { Transform } from './Transform'

const uDelay = fromCallback(
  function delay (ms, callback) {
    setTimeout(callback, ms, null)
  }
)

const uPipeline = fromCallback(pipeline)

test.cb('Transform transform callback', t => {
  t.plan(200)
  uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Transform({
      objectMode: true,
      transform (chunk, encoding, callback) {
        t.is(chunk, 1)
        this.push(chunk * -1)
        uDelay(10, callback)
      }
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.is(chunk, -1)
        callback()
      }
    }),
    t.end
  )
})

test('Transform transform promise', async t => {
  t.plan(200)
  await uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Transform({
      objectMode: true,
      async transform (chunk) {
        t.is(chunk, 1)
        this.push(chunk * -1)
        await uDelay(10)
      }
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.is(chunk, -1)
        callback()
      }
    })
  )
})

test('Transform concurrency', async t => {
  t.plan(100)

  const concurrency = 4
  const items = 100

  let jobs = 0
  let index = 0

  await uPipeline(
    Readable.from(new Array(items).fill(1)),
    new Transform({
      concurrency,
      objectMode: true,
      async transform () {
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
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        callback()
      }
    })
  )
})
