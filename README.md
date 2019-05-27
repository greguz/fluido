# fluido

[![Build Status](https://travis-ci.com/greguz/fluido.svg?branch=master)](https://travis-ci.com/greguz/fluido) [![npm version](https://badge.fury.io/js/fluido.svg)](https://badge.fury.io/js/fluido) [![Dependencies Status](https://david-dm.org/greguz/fluido.svg)](https://david-dm.org/greguz/fluido.svg) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

It means _fluid_ in Italian, and yes, this is **yet another streaming lib**.

## Why

On _npm_ you can find a plethora of libs useful to work with the Node.js streams.
The main problem is that the majority of those libs was created to fill some
lacking feature inside Node.js, but starting from the version 10 of Node.js,
a lot of those _hacks_ are not necessary anymore.

This package aims to be a streaming toolkit that makes advantage of
the last improvements of Node.js, and remove all the unecessary
_hacky_ code and dependencies.

## Features

- The [backpressure mechanism](https://nodejs.org/en/docs/guides/backpressuring-in-streams/) is respected by all functions
- Full TypeScript support
- Prevent `new` keyword usage
- No stream class method override (reads *no hacks*)
- Node.js >= 10

## API

#### readable(options)

Creates a new readable stream.

#### writable(options)

Creates a new writable stream. To enable concurrent mode, use `concurrency` option.

#### duplex(options)

Creates a new duplex stream.

#### transform(options)

Creates a new transform stream. To enable concurrent mode, use `concurrency` option.

#### finished(...streams, callback)

Fire callback when the stream closes.
If callback is `undefined`, returns a promise.

#### handle(...streams, callback)

Watch all streams, if any stream will emit an error, destroy the others.
When all streams have finished, callback is fired.
If callback is `undefined`, returns a promise.

#### pump(...streams, callback)

Pump a streams pipeline and handle all possible errors.
Returs the last piped stream or, if callback is `undefined`,
returns a promise.

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
      // error occurred
    } else {
      // all done
    }
  }
)
```

#### collect(encoding)

Returns a transform stream that collect all streamed data.
Encoding may by `'buffer'` for single buffer concat, `false` for raw array output, an **encoding** for string output, or `undefined` for auto.

#### subscribe(...streams, callback)

Pump a pipeline and fire the callback with the last value emitted by the pipeline.
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
      // handle error
    } else {
      // do something with the resulting image buffer
    }
  }
)
```

#### readify(streams, options)

Concat multiple streams into a single readable stream.

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

#### writify(streams, options)

Concat multiple streams into a single writable stream.

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

#### duplexify(readable, writable, options)

Join a readable and a writable stream into a single duplex stream.
All arguments are optional.

#### mergeReadables(sources, options)

Merge multiple readable streams into a single readable stream.

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

#### mergeWritables(targets, options)

Merge multiple writable streams into a single writable stream.

```javascript
const { mergeWritables } = require('fluido')
const { createReadStream, createWriteStream } = require('fs')

const singleWritableStream = mergeWritables([
  createWriteStream('/home/mom/images/cat.jpg'),
  createWriteStream('/home/grandma/images/cat.jpg')
])

createReadStream('cat.jpg').pipe(singleWritableStream)
```

#### isStream(value)

Returns `true` when `value` is a stream instance.

#### isReadable(value)

Returns `true` when `value` is a writable stream instance.
Keep in mind that transform and duplex streams are also readable instances.

#### isWritable(value)

Returns `true` when `value` is a writable stream instance.
Keep in mind that transform and duplex streams are also writable instances.

#### isDuplex(value)

Returns `true` when `value` is a duplex stream instance.
Keep in mind that a transform stream is also a duplex instance.

#### isTransform(value)

Returns `true` when `value` is a transform stream instance.

#### isReadableStrictly(value)

Returns `true` when `value` is **strictly** a readable stream instance.

#### isWritableStrictly(value)

Returns `true` when `value` is **strictly** a writable stream instance.

#### isDuplexStrictly(value)

Returns `true` when `value` is **strictly** a duplex stream instance.

## Caveats

Because of the incredible amount of ways you can use to create a stream,
functions like `isStream` and similar may not work correctly with some libs.
An example of that is `JSONStream`. If you fire `isDuplex`
with an instance of `JSONStream`, you get a `false` as result.
