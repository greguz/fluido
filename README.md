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

Create *readable* stream.
All [core options](https://nodejs.org/api/stream.html#stream_new_stream_readable_options) are supported.

##### callback mode

It is possible to use an _optional callback_ inside the `read` method.
First argument is the error, the second argument is the stream chunk.
Both are optional.

```javascript
const { readable } = require('fluido')

const stream = readable({
  objectMode: true,
  read (size, callback) {
    let index = 0
    const timer = setInterval(() => this.push(index++), 1000)

    setTimeout(() => {
      clearInterval(timer)
      // Pass null to end the stream
      callback(null, null)
    }, 5000)
  }
})
```

#### writable(options)

Create *writable* stream.
All [core options](https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options) are supported.

##### concurrent mode

To make the *write* method concurrent, you can specify the `concurrency` option.
By default, all chunks are processed sequantially and synchronously.
You can make this process **async** with this option.

```javascript
const { writable } = require('fluido')

const stream = writable({
  objectMode: true,
  concurrency: 10, // Fire write function max 10 times at the same time
  write (chunk, encoding, callback) {
    // Do something async with chunk
    something(chunk, callback)
  }
})
```

#### duplex(options)

Create *duplex* stream.
All [core options](https://nodejs.org/api/stream.html#stream_new_stream_duplex_options) are supported.

Both [callback mode](#callback-mode) and [concurrent mode](#concurrent-mode) are supported.

#### transform(options)

Create *transform* stream.
All [core options](https://nodejs.org/api/stream.html#stream_new_stream_transform_options) are supported.

The `transform` function supports [concurrent mode](#concurrent-mode).

#### eos(stream, options, callback)

Register a **e**nd-**o**f-**s**tream callback.
If callback is `undefined`, returns a promise.

```javascript
const { eos } = require('fluido')

// Fire callback when readable has finished
eos(readable, callback)

// Fire callback when writable has finished
eos(writable, callback)

// Fire callback when duplex has finished (both reading and writing)
eos(duplex, callback)

// Fire callback when duplex has finished to read
eos(duplex, { writable: false }, callback)

// Fire callback when duplex has finished to write
eos(duplex, { readable: false }, callback)
```

##### options.readable : boolean

When set to false, the callback will be called when the stream ends even though the stream might still be readable. Default: `true`.

##### options.writable : boolean

When set to false, the callback will be called when the stream ends even though the stream might still be writable. Default: `true`.

##### options.error : boolean

If set to false, then a call to emit('error', err) is not treated as finished. Default: `true`.

#### finished(...streams, callback)

Fire callback when all streams have finished.
If callback is `undefined`, returns a promise.

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

You can pass [eos options](#eos(stream,-options,-callback)) using an array to store both the stream (index `0`) and the options (index `1`).

```javascript
finished(
  [duplex, { writable: false }],
  writable,
  callback
)
```

#### handle(...streams, callback)

Same as [finished](#finished(...streams,-callback)), plus the streams are automatically destroyed at the first encountered error.

#### pump(...streams, callback)

Pump a streams pipeline and handle all possible errors.
If callback is `undefined`, returns a promise.

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
      // Handle error
    } else {
      // Do something with the resulting image buffer
    }
  }
)
```

#### readify(streams[], options)

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

#### writify(streams[], options)

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

#### mergeReadables(sources[], options)

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

#### mergeWritables(targets[], options)

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

#### isReadable(value)

Returns `true` when `value` is a readable stream instance.

#### isWritable(value)

Returns `true` when `value` is a writable stream instance.

#### isStream(value)

Returns `true` when `value` is readable **or** writable.

#### isDuplex(value)

Returns `true` when `value` is both readable **and** writable.

#### isReadableStrictly(value)

Returns `true` when `value` is readable **and not** writable.

#### isWritableStrictly(value)

Returns `true` when `value` is writable **and not** readable.
