# fluido

[![npm version](https://badge.fury.io/js/fluido.svg)](https://badge.fury.io/js/fluido)
[![Dependencies Status](https://david-dm.org/greguz/fluido.svg)](https://david-dm.org/greguz/fluido.svg)
[![ci](https://github.com/greguz/fluido/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/greguz/fluido/actions/workflows/ci.yaml)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Fluido is a drop-in replacement for the native `stream` module. It adds some functions that aren't included in the standard module and adds `Promise` support to stream methods. It also enables _concurrent_ jobs while writing or transforming.

## Install

```
npm install --save fluido
```

## Callback and Promise

Normally, all Node.js async functions use callbacks as the output mode.

```javascript
const { Readable, Writable, pipeline } = require('stream')

pipeline(
  new Readable({
    read (size) {
      // Push some chunks
    }
  }),
  new Writable({
    write (chunk, encoding, callback) {
      // Handle incoming chunk
      callback()
    }
  }),
  err => {
    // Handle error
  }
)
```

With Fluido, all functions will return a `Promise` if a callback is not provided. Plus, a `Promise` returned inside any internal streaming method (`_write`, `_writev`, `_final`, `_transform`, `_flush`, and `_destroy`) is correctly handled. Both "simplified constructor" and "class inheritance" methods are supported.

```javascript
const { Readable, Writable, pipeline } = require('fluido')

pipeline(
  new Readable({
    read (size) {
      // Push some chunks
    }
  }),
  new Writable({
    async write (chunk, encoding) {
      await promisedStuff(chunk)
    }
  })
).catch(err => console.error(err))
```

Readable streams do **not** use a callback inside the `_read` method. To support async readings, Fluido adds a new method, `_asyncRead`, that, if specified, will override the original one. Both callback and `Promise` are supported.

```javascript
const { Readable } = require('fluido')

new Readable({
  async asyncRead (size) {
    const chunks = await readSource(size)
    for (const chunk of chunks) {
      this.push(chunk)
    }
  }
})
```

## Concurrency

Passing the `concurrency` option to the Writable (may be Duplex or Transform) constructor will cause _write (or _transform) calls to be concurrent.

```javascript
const { Writable } = require('fluido')

new Writable({
  concurrency: 8,
  async write (chunk) {
    // Max 8 _write calls at the same time
  }
})
```

## Detection

- [isNodeStream](docs/is.md#isNodeStreamvalue)
- [isReadableStream](docs/is.md#isReadableStreamvalue)
- [isWritableStream](docs/is.md#isWritableStreamvalue)
- [isDuplexStream](docs/is.md#isDuplexStreamvalue)

## Lifecycle

- [finished](docs/finished.md)
- [pipeline](docs/pipeline.md)

## Manipulation

- [merge](docs/merge.md)
