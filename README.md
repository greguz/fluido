# fluido

[![npm version](https://badge.fury.io/js/fluido.svg)](https://badge.fury.io/js/fluido)
[![Dependencies Status](https://david-dm.org/greguz/fluido.svg)](https://david-dm.org/greguz/fluido.svg)
[![Build Status](https://travis-ci.com/greguz/fluido.svg?branch=master)](https://travis-ci.com/greguz/fluido)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Elfo](.github/elfo.png)

Hi, I'm Fluido!

## What

Fluido is a drop-in replacement for native `stream` module.

## Why

- Adds **Promise support** to all internal methods (`read`, `write`, `writev`, `final`, `transform`, `flush`, `destroy`)
- Enables **concurrency** on `write` and `transform` methods
- Respects the [backpressure mechanism](https://nodejs.org/en/docs/guides/backpressuring-in-streams/)
- TypeScript friendly

## Install

```
npm install --save fluido
```
