import test from 'ava'

import { Readable, Writable, pipeline } from 'readable-stream'
import { fromCallback } from 'universalify'

import { Duplex } from './Duplex'

const uDelay = fromCallback(
  function delay (ms, callback) {
    setTimeout(callback, ms, null)
  }
)

const uPipeline = fromCallback(pipeline)

test('Duplex read', t => {
  t.plan(21)
  const steps = 10
  let index = 0
  const stream = new Duplex({
    objectMode: true,
    read () {
      t.pass()
      this.push(index < steps ? index++ : null)
    }
  })
  let value = stream.read()
  while (value !== null) {
    t.true(typeof value === 'number')
    value = stream.read()
  }
})

test.cb('Duplex asyncRead', t => {
  t.plan(23)

  const steps = 10
  let ri = 0
  let wi = 0

  pipeline(
    new Duplex({
      objectMode: true,
      asyncRead (size, callback) {
        t.pass()
        setTimeout(
          () => callback(null, ri < steps ? ri++ : null),
          10
        )
      }
    }),
    new Writable({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.is(chunk, wi++)
        callback()
      }
    }),
    err => {
      if (!err) {
        t.is(ri, 10)
        t.is(wi, 10)
      }
      t.end(err)
    }
  )
})

test.cb('Duplex write callback', t => {
  t.plan(100)
  uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Duplex({
      objectMode: true,
      write (chunk, encoding, callback) {
        t.is(chunk, 1)
        uDelay(10, callback)
      }
    }),
    t.end
  )
})

test('Duplex write promise', async t => {
  t.plan(100)
  await uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Duplex({
      objectMode: true,
      async write (chunk) {
        t.is(chunk, 1)
        await uDelay(10)
      }
    })
  )
})

test.cb('Duplex writev callback', t => {
  t.plan(100)
  uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Duplex({
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

test('Duplex writev promise', async t => {
  t.plan(100)
  await uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Duplex({
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

test.cb('Duplex final callback', t => {
  t.plan(1)
  let count = 0
  uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Duplex({
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

test('Duplex final promise', async t => {
  t.plan(1)
  let count = 0
  await uPipeline(
    Readable.from(new Array(100).fill(1)),
    new Duplex({
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

test('Duplex concurrency', async t => {
  t.plan(100)

  const concurrency = 4
  const items = 100

  let jobs = 0
  let index = 0

  await uPipeline(
    Readable.from(new Array(items).fill(1)),
    new Duplex({
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
