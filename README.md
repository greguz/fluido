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

## Creation

- [Readable](docs/Readable.md)
- [Writable](docs/Writable.md)
- [Duplex](docs/Duplex.md)
- [Transform](docs/Transform.md)

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
