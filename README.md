# fluido

[![npm version](https://badge.fury.io/js/fluido.svg)](https://badge.fury.io/js/fluido)
[![Dependencies Status](https://david-dm.org/greguz/fluido.svg)](https://david-dm.org/greguz/fluido.svg)
[![Build Status](https://travis-ci.com/greguz/fluido.svg?branch=master)](https://travis-ci.com/greguz/fluido)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Elfo](.github/elfo.png)

Hi, I'm Fluido!

## Why

This package aims to be a collection of utilities
useful to work along Node.js streams.

If you are new to the concept of *Stream*,
you may want first to read the
[official docs](https://nodejs.org/docs/latest/api/stream.html).

## Features

- Uses the last version of [readable-stream](https://www.npmjs.com/package/readable-stream) module internally
- TypeScript friendly
- Avoids explicit subclassing noise
- Adds **Promise support** to all internal methods (`read`, `write`, `writev`, `final`, `transform`, `flush`, `destroy`)
- Enables **concurrency** on `write` and `transform` methods
- Respects the [backpressure mechanism](https://nodejs.org/en/docs/guides/backpressuring-in-streams/)
- Supports Node.js >= **8.0**
- Has a reference to *Disenchantment* <!-- pls Matt don't sue me -->

## Install

```
npm install --save fluido
```

## Stream creation

### readable([options])

- options `<Object>` [docs](https://nodejs.org/api/stream.html#stream_new_stream_readable_options)
- Returns: `<Readable>`

Creates a *Readable* stream.

### writable([options])

- options `<Object>` [docs](https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options)
  - concurrency `<Number>` Enables concurrent `write` calls
- Returns: `<Writable>`

Creates a *Writable* stream.

### duplex([options])

- options `<Object>` [docs](https://nodejs.org/api/stream.html#stream_new_stream_duplex_options)
  - concurrency `<Number>` Enables concurrent `write` calls
- Returns: `<Duplex>`

Creates a *Duplex* stream.

### transform([options])

- options `<Object>` [docs](https://nodejs.org/api/stream.html#stream_new_stream_transform_options)
  - concurrency `<Number>` Enables concurrent `transform` calls
- Returns: `<Transform>`

Creates a *Transform* stream.

### Promise support

Using the above method to create a stream, you'll be able to
use both *Promises* or *callbacks* on any internal method (`read`, `write`, `writev`, `final`, `transform`, `flush`, `destroy`).

The `read` method is the only one that may be used synchronously,
as the original implementation.

Methods `read`, `transform` and `flush` treats
the Promise's resolution value
or the callback's second argument
as incoming data to automatically `push()` into the stream.

## Type check

### isReadable(value)

- value `<any>`
- Returns: `<Boolean>`

Returns `true` when *value* is a Readable stream.

### isWritable(value)

- value `<any>`
- Returns: `<Boolean>`

Returns `true` when *value* is a Writable stream.

### isStream(value)

- value `<any>`
- Returns: `<Boolean>`

Returns `true` when *value* is a Readable **or** a Writable stream.

### isDuplex(value)

- value `<any>`
- Returns: `<Boolean>`

Returns `true` when *value* is both a Readable **and** a Writable stream.

### isReadableStrictly(value)

- value `<any>`
- Returns: `<Boolean>`

Returns `true` when *value* is **just** Readable.

### isWritableStrictly(value)

- value `<any>`
- Returns: `<Boolean>`

Returns `true` when *value* is **just** Writable.

## Lifecycle

### eos(stream, [options], callback)

- stream `<Stream>`
  Target stream to inspect.
- options `<Object>`
  - readable `<Boolean>`
    When set to `false`, the *callback* will be called
    when the stream ends even though the stream might still be readable.
    Default: `true`.
  - writable `<Boolean>`
    When set to `false`, the *callback* will be called
    when the stream ends even though the stream might still be writable.
    Default: `true`.
  - error `<Boolean>`
    If set to `false`, then a call to `emit('error', err)`
    is not treated as finished.
    Default: `true`.
- callback `<Function>`
  A callback function that takes an optional error argument.
- Returns: `<Function>`
  A cleanup function that removes all registered listeners.

Registers an **e**nd-**o**f-**s**tream callback, which is called when a stream
is no longer readable, writable or has experienced an error
or a premature close event.

```javascript
// End of reading
eos(readable, err => { })

// End of writing
eos(writable, err => { })

// Both end of reading and writing
eos(duplex, err => { })

// Just the end of reading
eos(duplex, { writable: false }, err => { })
```

### finished(...streams, callback)

- streams `<...Stream>`
  Array of streams to inspect.
- callback `<Function>`
  A callback function that takes an optional error argument.
- Returns: `<Function>`
  A cleanup function that removes all registered listeners.

Same features of its [eos](#eosstream-options-callback) counterpart,
but supporting multiple streams.

```javascript
const { finished } = require('fluido')
const { createReadStream, createWriteStream } = require('fs')

const source = createReadStream('/home/mom/images/cat.jpg')
const target = createWriteStream('/home/grandma/images/cat.jpg')

finished(source, target, err => {
  // All streams are closed now
  if (err) {
    // Handle error
  } else {
    // All done
  }
})

source.pipe(target)
```

It is also possible to use [eos options](#eosstream-options-callback)
by wrapping both the stream and the required options into an array.

```javascript
finished(
  // Just the end of reading
  [duplex, { readable: false }],
  // End of writing
  writable,
  callback
)
```

### handle(...streams, callback)

- streams `<...Stream>`
  Array of streams to handle.
- callback `<Function>`
  A callback function that takes an optional error argument.
- Returns: `<Function>`
  A cleanup function that removes all registered listeners.

Similar to [finished](#finishedstreams-callback), but destroys the
streams at the first encountered error.

### pump(...streams, [callback])

- streams `<...Stream>`
  A pipeable chain of streams.
- callback `<Function|undefined>`
  A callback function that takes an optional error argument.
- Returns: `<undefined|Promise>`
  If *callback* is `undefined` returns a Promise.

Pipes between streams forwarding errors and properly cleaning up
and provide a callback when the pipeline is complete.

```javascript
const { pump } = require('fluido')
const { createReadStream, createWriteStream } = require('fs')
const sharp = require('sharp')

pump(
  // Read source image
  createReadStream('cat.jpg'),
  // Process image data
  sharp().resize(200, 200).png(),
  // Write target image
  createWriteStream('cat.png'),
  // Final callback
  err => {
    if (err) {
      // Handle error
    } else {
      // And they live happily ever after
    }
  }
)
```

### subscribe(...streams, [callback])

- streams `<...Stream>`
  A pipeable chain of streams.
- callback `<Function|undefined>`
  A callback function that takes an optional error argument.
- Returns: `<undefined|Promise>`
  If *callback* is `undefined` returns a Promise.

Pump streams and fire the callback with the last value emitted by the pipeline
as second argument.
If callback is `undefined`, returns a promise.

```javascript
const { collect, subscribe } = require('fluido')
const { createReadStream } = require('fs')
const sharp = require('sharp')

subscribe(
  // Read the source image
  createReadStream('cat.jpg'),
  // Process image data
  sharp().resize(200, 200).png(),
  // Collect all chunks into a single buffer
  collect('buffer'),
  // Final callback
  (err, buffer) => {
    if (err) {
      // Handle error
    } else {
      // Do something with the resulting image buffer
    }
  }
)
```

## Stream manipulation

### collect([target])

- target `<any>` Represents the expected output type.
  - `'buffer'` Collect chunks into a single Buffer.
  - `<String>` Decode buffers using this encoding and collect chunks as a   string.
  - `false` Results an array of all collected raw chunks.
  - `undefined` Enable auto-mode. It try to guess the correct output by
    checking the first collected chunk from the source stream.
- Returns: `<Transform>`

Returns a *Transform* stream that collects all received chunks and then
emits them.

### readify(streams[], [options])

- streams `<Stream[]>`
  Array of pipeable streams to merge.
- options `<Object>`
  Readable options applied to the resulting stream.
- Returns: `<Readable>`

Join a pipeline into a single *Readable* stream.

```javascript
const { readify } = require('fluido')
const { createReadStream, createWriteStream } = require('fs')
const sharp = require('sharp')

const singleReadableStream = readify([
  // Read source image
  createReadStream('cat.jpg'),
  // Process image data
  sharp().resize(200, 200).png()
])

singleReadableStream.pipe(createWriteStream('cat.png'))
```

### writify(streams[], [options])

- streams `<Stream[]>`
  Array of pipeable streams to merge.
- options `<Object>`
  Writable options applied to the resulting stream.
- Returns: `<Writable>`

Join a pipeline into a single *Writable* stream.

```javascript
const { writify } = require('fluido')
const { createReadStream, createWriteStream } = require('fs')
const sharp = require('sharp')

const singleWritableStream = writify([
  // Process image data
  sharp().resize(200, 200).png(),
  // Write target image
  createWriteStream('cat.png')
])

createReadStream('cat.jpg').pipe(singleWritableStream)
```

### duplexify(readable, writable, [options])

- readable `<Readable|null>`
  Source Readable stream.
- writable `<Writable|null>`
  Target Writable stream.
- options `<Object>`
  Duplex options applied to the resulting stream.
- Returns: `<Duplex>`

Join a Readable and a Writable stream into a Duplex stream.

### mergeReadables(readables[], [options])

- readables `<Readable[]>`
  Array of Readable streams to merge.
- options `<Object>`
  Readable options applied to the resulting stream.
- Returns: `<Readable>`

Merge multiple Readable streams into a single Readable stream.

```javascript
const { mergeReadables } = require('fluido')
const JSONStream = require('JSONStream')
const { createWriteStream } = require('fs')

const animals = mergeReadables([
  db.collection('cats').find(),
  db.collection('dogs').find(),
  db.collection('pythons').find()
], { objectMode: true })

animals
  .pipe(JSONStream.stringify())
  .pipe(createWriteStream('animals.json'))
```

### mergeWritables(writables[], [options])

- writables `<Writable[]>`
  Array of Writable streams to merge.
- options `<Object>`
  Writable options applied to the resulting stream.
- Returns: `<Writable>`

Merge multiple Writable streams into a single Writable stream.

```javascript
const { mergeWritables } = require('fluido')
const { createReadStream, createWriteStream } = require('fs')

const singleWritableStream = mergeWritables([
  createWriteStream('/home/mom/images/cat.jpg'),
  createWriteStream('/home/grandma/images/cat.jpg')
])

createReadStream('cat.jpg').pipe(singleWritableStream)
```
