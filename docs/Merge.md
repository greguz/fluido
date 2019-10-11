# Merge

These functions are useful for reducing multiple streams.

## readify(streams[], options)

- streams `<Stream[]>`
  Array of pipeable streams to merge.
- options `<Object>`
  Readable [options](Readable.md#Options) applied to the resulting stream.
- Returns: `<Readable>`

Join a pipeline into a single Readable stream.

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

## writify(streams[], options)

- streams `<Stream[]>`
  Array of pipeable streams to merge.
- options `<Object>`
  Writable [options](Writable.md#Options) applied to the resulting stream.
- Returns: `<Writable>`
  TODO

Join a pipeline into a single Writable stream.

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

## duplexify(readable, writable, options)

- readable `<Readable|null>`
  Source Readable stream.
- writable `<Writable|null>`
  Target Writable stream.
- options `<Object>`
  Duplex [options](Duplex.md#Options) applied to the resulting stream.
- Returns: `<Duplex>`

Join a Readable and a Writable stream into a Duplex stream.

## mergeReadables(readables[], options)

- readables `<Readable[]>`
  Array of Readable streams to merge.
- options `<Object>`
  Readable [options](Readable.md#Options) applied to the resulting stream.
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

## mergeWritables(writables[], options)

- writables `<Writable[]>`
  Array of Writable streams to merge.
- options `<Object>`
  Writable [options](Writable.md#Options) applied to the resulting stream.
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
