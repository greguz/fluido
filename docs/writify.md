# writify([options, ]...transforms, target)

Joins a series of transformations (Transform) and a target (Writable) into a single Writable stream.

- `options` `<Object>`
- `...transforms` `<Duplex>`
- `target` `<Writable>`
- Returns: `<Writable>`

## Example

```javascript
const { Transform, Writable, writify } = require('fluido')

const stream = writify(
  { objectMode: true },
  new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      console.log(chunk)
      callback(null, chunk + 41)
    }
  }),
  new Writable({
    objectMode: true,
    write (chunk, encoding, callback) {
      console.log(chunk)
      callback()
    }
  })
)

stream.write(1) // Logs '1' and '42'
```
