# readify([options, ]source, ...transforms)

Joins a source (Readable) and a series of transformations (Transform) into a single Readable stream.

- `options` `<Object>`
- `source` `<Readable>`
- `...transforms` `<Duplex>`
- Returns: `<Readable>`

## Example

```javascript
const { Readable, Transform, readify } = require('fluido')

function map (mapper) {
  let index = 0
  return new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      callback(null, mapper(chunk, index++))
    }
  })
}

const stream = readify(
  { objectMode: true },
  Readable.from(new Array(10).fill(1)),
  map(value => value + 41)
)

stream.on('data', data => console.log(data)) // Logs '42' ten times
```
