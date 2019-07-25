import test from 'ava'
import { Readable, Writable, Duplex } from 'stream'
import { eos } from '../src/index.js'

test.cb('eos readable', t => {
  const stream = new Readable({
    read () {
      this.push(null)
    }
  })

  eos(stream, t.end)

  stream.resume()
})

test.cb('eos writable', t => {
  const stream = new Writable({
    write (chunk, encoding, callback) {
      callback()
    }
  })

  eos(stream, t.end)

  stream.write('test')
  stream.end()
})

test.cb('eos duplex', t => {
  const stream = new Duplex({
    read () {
      this.push(null)
    },
    write (chunk, encoding, callback) {
      callback()
    }
  })

  eos(stream, t.end)

  stream.resume()

  stream.write('test')
  stream.end()
})

test.cb('eos readable option', t => {
  const stream = new Duplex({
    read () {
      // infinite read
    },
    write (chunk, encoding, callback) {
      callback()
    }
  })

  eos(stream, { readable: false }, t.end)

  stream.resume()

  stream.write('test')
  stream.end()
})

test.cb('eos writable option', t => {
  const stream = new Duplex({
    read () {
      this.push(null)
    },
    write () {
      // infinite write
    }
  })

  eos(stream, { writable: false }, t.end)

  stream.resume()

  stream.write('test')
  stream.end()
})
