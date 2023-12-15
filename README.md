# fluido

[![npm version](https://badge.fury.io/js/fluido.svg)](https://badge.fury.io/js/fluido)
[![Dependencies Status](https://david-dm.org/greguz/fluido.svg)](https://david-dm.org/greguz/fluido.svg)
[![ci](https://github.com/greguz/fluido/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/greguz/fluido/actions/workflows/ci.yaml)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Fluido is a drop-in replacement for the native `stream` module. It adds some functions that aren't included in the standard module and adds `Promise` support to stream methods. It also enables _concurrent_ jobs while writing or transforming.

## Features

- **Promise**: you can use `async/await` inside stream methods, and functions without a callback will return a `Promise`.
- **Concurrency**: a concurrency option available for `Writable` and `Transform` streams.
- **ESM**: support native ESM (`import` and `export` keywords).
- **CommonJS**: support old Node.js runtimes (`require`).
- **TypeScript**: types declaration are included.

## Install

```
npm install --save fluido
```

## Usage

### Callback and `Promise`

The [`pipeline`](https://nodejs.org/api/stream.html#streampipelinestreams-callback) and [`finished`](https://nodejs.org/api/stream.html#streamfinishedstream-options-callback) functions now returns a `Promise` if a callback function is not provided as last argument.

The `pipeline` function supports mapping functions as argument. This makes not possibile to Fluido to understand when the last function passed inside the pipeline is a callback or a mapping function.

A special type of callback needs to be used in that case:

```javascript
import { asCallback, isCallback, pipeline } from 'fluido'

const callback = asCallback(err => {
  if (err) {
    // handle error
  } else {
    // all done
  }
})

console.log(isCallback(callback)) // true
console.log(isCallback(() => {})) // false

pipeline(source, mapSource, callback)
```

### Stream with `async/await`

Stream implementation methods `_construct`, `_write`, `_writev`, `_final`, `_transform`, `_flush`, and `_destroy` (and their option conunterpart) now support the `async` keyword and/or a `Promise` as return value.

```javascript
import { Readable, Transform, Writable } from 'fluido'

const r = new Readable({
  async construct () {
    // construct async stuff
  },
  async destroy () {
    // destroy async stuff
  }
})

const t = new Transform({
  async construct () {
    // construct async stuff
  },
  async transform (chunk) {
    // transform async stuff
  },
  async flush () {
    // flush async stuff
  },
  async destroy () {
    // destroy async stuff
  }
})

const w = new Writable({
  async construct () {
    // construct async stuff
  },
  async write (chunk) {
    // write async stuff
  },
  async writev (items) {
    // write async stuff
  },
  async final () {
    // finalize async stuff
  },
  async destroy () {
    // destroy async stuff
  }
})
```

A _Readable_ stream does not implement a callback for the `_read` method by default. Because of that, It's not possible for Fluido to automatically detect when the `_read` method needs to be `async`.

To support `async` reads, a new method is available: `_asyncRead` (along side with its `asyncRead` option).

```javascript
import { Readable } from 'fluido'

const r = new Readable({
  async asyncRead (size) {
    // read async stuff
  }
})
```

### Concurrency

Passing the `concurrency` option to the Writable (may be Duplex or Transform) constructor will cause _write (or _transform) calls to be concurrent.

```javascript
const { Transform, Writable } = require('fluido')

const w = new Writable({
  concurrency: 8,
  async write (chunk) {
    // At most 8 concurrent writes
  }
})

const t = new Transform({
  concurrency: 8,
  async transform (chunck) {
    // At most 8 concurrent transforms
  }
})
```

### isNodeStream(value)

Returns `true` if `value` is a _Readable_ **or** a _Writable_ stream.

- `value` `<*>`
- Returns: `<Boolean>`

```javascript
import { Readable, Writable, isNodeStream } from 'fluido'

console.log(isNodeStream(new Readable())) // true
console.log(isNodeStream(new Writable())) // true
```

### isReadableStream(value)

Returns `true` if `value` is a _Readable_ stream.

- `value` `<*>`
- Returns: `<Boolean>`

```javascript
import { Readable, Writable, isReadableStream } from 'fluido'

console.log(isReadableStream(new Readable())) // true
console.log(isReadableStream(new Writable())) // false
```

### isWritableStream(value)

Returns `true` if `value` is a _Writable_ stream.

- `value` `<*>`
- Returns: `<Boolean>`

```javascript
import { Readable, Writable, isWritableStream } from 'fluido'

console.log(isWritableStream(new Readable())) // false
console.log(isWritableStream(new Writable())) // true
```

### isDuplexStream(value)

Returns `true` if `value` is both a _Readable_ **and** a _Writable_ stream.

- `value` `<*>`
- Returns: `<Boolean>`

```javascript
import { Duplex, Readable, Writable, isDuplexStream } from 'fluido'

console.log(isDuplexStream(new Readable())) // false
console.log(isDuplexStream(new Writable())) // false
console.log(isDuplexStream(new Duplex())) // true
```

### merge(...streams)

Combines two or more streams into a _Duplex_ stream that writes concurrently to all _Writable_ streams and reads concurrently from all _Readable_ streams.

- `streams` `<Stream[]>`
- Returns: `<Duplex>`

## Donate

Thank you!

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/greguz)
