# fluido

[![npm version](https://badge.fury.io/js/fluido.svg)](https://badge.fury.io/js/fluido)
[![Dependencies Status](https://david-dm.org/greguz/fluido.svg)](https://david-dm.org/greguz/fluido.svg)
[![Build Status](https://travis-ci.com/greguz/fluido.svg?branch=master)](https://travis-ci.com/greguz/fluido)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Elfo](.github/elfo.png)

Hi, I'm Fluido!

## What

Fluido is a drop-in replacement for the native `stream` module. It adds some functions that aren't included in the standard module and adds `Promise` support to stream methods. It also enables _concurrent_ jobs while writing or transforming.

## Install

```
npm install --save fluido
```

## Callback and Promise

Stream methods use callbacks by default. Fluido adds `Promise` support to `_write`, `_writev`, `_final`, `_transform`, `_flush`, and `_destroy` methods. The method just needs to return a `Promise` somehow, that's It. Both "simplified constructor" and class inheritance ways are supported.

Async `_write` with simplified constructor:

```javascript
new Writable({
  async write (chunk, encoding) {
    await doSomething(chunk)
  }
})
```

Async `_transform` with class inheritance:

```javascript
class MyTransform extends Transform {
  async _transform (chunk, encoding) {
    await doSomething(chunk)
  }
}
```

Readable streams do **not** use a callback inside the `_read` method. To support async readings, Fluido adds a new method, `_asyncRead`, that, if specified, will override the original one.

```javascript
new Readable({
  async asyncRead (size, callback) {
    readSource(size, (err, chunks) => {
      if (err) {
        callback(err)
        return
      }
      for (const chunk of chunks) {
        this.push(chunk)
      }
    })
  }
})
```

Class inheritance is still supported by the new method.

```javascript
class MyReadable extends Readable {
  async _asyncRead (size) {
    const chunks = await readSource(size)
    for (const chunk of chunks) {
      this.push(chunk)
    }
  }
}
```

## Detection

- [isReadable](docs/is.md#isReadablevalue)
- [isWritable](docs/is.md#isWritablevalue)
- [isDuplex](docs/is.md#isDuplexvalue)
- [isStream](docs/is.md#isStreamvalue)
- [isReadableStrictly](docs/is.md#isReadableStrictlyvalue)
- [isWritableStrictly](docs/is.md#isWritableStrictlyvalue)

## Lifecycle

- [finished](docs/finished.md)
- [pipeline](docs/pipeline.md)
- [subscribe](docs/subscribe.md)

## Manipulation

- [readify](docs/readify.md)
- [writify](docs/writify.md)
- [duplexify](docs/duplexify.md)

## Operators

- [collect](docs/collect.md)
