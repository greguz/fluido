import test from 'ava'
import { Readable } from 'stream'

import { finished } from '../index.js'

function build (time, start, end) {
  let active = false
  return new Readable({
    read () {
      if (active) {
        return
      } else {
        active = true
      }
      start()
      setTimeout(() => {
        end()
        this.push(null)
      }, time)
    }
  })
}

test('finished promise', async t => {
  let started = 0
  let ended = 0

  const start = () => started++
  const end = () => ended++

  const streams = [
    build(1, start, end),
    build(10, start, end),
    build(100, start, end)
  ]

  for (const stream of streams) {
    stream.resume()
  }

  await finished(...streams)

  t.is(started, streams.length)
  t.is(ended, streams.length)

  t.pass()
})

test('finished callback', async t => {
  let started = 0
  let ended = 0

  const start = () => started++
  const end = () => ended++

  const streams = [
    build(1, start, end),
    build(10, start, end),
    build(100, start, end)
  ]

  for (const stream of streams) {
    stream.resume()
  }

  await new Promise((resolve, reject) => {
    finished(...streams, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

  t.is(started, streams.length)
  t.is(ended, streams.length)

  t.pass()
})

test('finished empty', async t => {
  await finished()
  t.pass()
})

test('finished single', async t => {
  let started = 0
  let ended = 0

  const start = () => started++
  const end = () => ended++

  const stream = build(100, start, end)

  stream.resume()

  await finished(stream)

  t.is(started, 1)
  t.is(ended, 1)

  t.pass()
})
