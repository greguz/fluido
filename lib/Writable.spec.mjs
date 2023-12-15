import test from 'ava'
import { Readable } from 'readable-stream'

import { finished } from './finished.mjs'
import { pipeline } from './pipeline.mjs'
import { Writable } from './Writable.mjs'

function sleep (ms, callback) {
  if (callback) {
    return sleep(ms).then(callback)
  }
  return new Promise(resolve => setTimeout(resolve, ms))
}

test('Writable write callback', async t => {
  t.plan(100)
  await pipeline(
    Readable.from(new Array(100).fill(1)),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.is(chunk, 1)
        sleep(10, callback)
      }
    })
  )
})

test('Writable write promise', async t => {
  t.plan(101)
  await pipeline(
    Readable.from(new Array(100).fill(1)),
    new Writable({
      objectMode: true,
      async construct () {
        t.pass()
      },
      async write (chunk) {
        t.is(chunk, 1)
        await sleep(10)
      }
    })
  )
})

test('Writable writev callback', async t => {
  t.plan(100)
  await pipeline(
    Readable.from(new Array(100).fill(1)),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.is(chunk, 1)
        sleep(10, callback)
      },
      writev (items, callback) {
        for (const item of items) {
          t.is(item.chunk, 1)
        }
        sleep(10, callback)
      }
    })
  )
})

test('Writable writev promise', async t => {
  t.plan(100)
  await pipeline(
    Readable.from(new Array(100).fill(1)),
    new Writable({
      objectMode: true,
      async write (chunk) {
        t.is(chunk, 1)
        await sleep(10)
      },
      async writev (items) {
        for (const item of items) {
          t.is(item.chunk, 1)
        }
        await sleep(10)
      }
    })
  )
})

test('Writable final callback', async t => {
  t.plan(1)
  let count = 0
  await pipeline(
    Readable.from(new Array(100).fill(1)),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        count += chunk
        callback()
      },
      final (callback) {
        t.is(count, 100)
        sleep(10, callback)
      }
    })
  )
})

test('Writable final promise', async t => {
  t.plan(1)
  let count = 0
  await pipeline(
    Readable.from(new Array(100).fill(1)),
    new Writable({
      objectMode: true,
      async write (chunk) {
        count += chunk
      },
      async final () {
        t.is(count, 100)
        await sleep(10)
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

  await pipeline(
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
        await sleep(10)
        jobs--
      }
    })
  )
})

test('Writable concurrency with error', async t => {
  t.plan(2)

  await t.throwsAsync(
    pipeline(
      Readable.from(new Array(10).fill('hello world')),
      new Writable({
        concurrency: 2,
        objectMode: true,
        async destroy (err) {
          t.like(err, { message: 'STOP' })
        },
        write () {
          return Promise.reject(new Error('STOP'))
        }
      })
    ),
    { message: 'STOP' }
  )
})

test('concurrent Writable without writes', async t => {
  t.plan(1)

  const stream = new Writable({
    concurrency: 2,
    objectMode: true,
    write () {
      t.fail()
      return Promise.reject(new Error())
    },
    final () {
      t.pass()
      return Promise.resolve()
    }
  })

  const promise = finished(stream)

  stream.end()

  await promise
})
