# fluido

[![npm version](https://badge.fury.io/js/fluido.svg)](https://badge.fury.io/js/fluido)
[![Dependencies Status](https://david-dm.org/greguz/fluido.svg)](https://david-dm.org/greguz/fluido.svg)
[![Build Status](https://travis-ci.com/greguz/fluido.svg?branch=master)](https://travis-ci.com/greguz/fluido)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![GitHub Logo](/docs/images/elfo.png)

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
- **Adds Promise support to all internal methods** (read, write, writev, final, transform, flush, destroy)
- Respects the [backpressure mechanism](https://nodejs.org/en/docs/guides/backpressuring-in-streams/)
- Supports Node.js >= **8.0**
- Has a reference to *Disenchantment* <!-- pls Matt don't sue me -->

## Install

```
npm install --save fluido
```

## API

### Stream creation

- [Readable](docs/Readable.md)
- [Writable](docs/Writable.md)
- [Duplex](docs/Duplex.md)
- [Transform](docs/Transform.md)

### Stream manipulation

- [Type](docs/Type.md)
- [Lifecycle](docs/Lifecycle.md)
- [Merge](docs/Merge.md)
- [Operators](docs/Operators.md)
