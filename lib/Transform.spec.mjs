import test from 'ava'
import { Readable, Writable } from 'readable-stream'

import { pipeline } from './pipeline.mjs'
import { Transform } from './Transform.mjs'

function sleep (ms, callback) {
  if (callback) {
    return sleep(ms).then(callback)
  }
  return new Promise(resolve => setTimeout(resolve, ms))
}

test('Transform transform callback', async t => {
  t.plan(200)
  await pipeline(
    Readable.from(new Array(100).fill(1)),
    new Transform({
      objectMode: true,
      transform (chunk, encoding, callback) {
        t.is(chunk, 1)
        this.push(chunk * -1)
        sleep(10, callback)
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

test('Transform transform promise', async t => {
  t.plan(200)
  await pipeline(
    Readable.from(new Array(100).fill(1)),
    new Transform({
      objectMode: true,
      async transform (chunk) {
        t.is(chunk, 1)
        this.push(chunk * -1)
        await sleep(10)
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

  await pipeline(
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
        await sleep(10)
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
