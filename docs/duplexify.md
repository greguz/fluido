# duplexify([options, ]readable[, writable])

Generates a Duplex stream by joining a Readable and Writable stream.

- `options` `<Object>`
- `readable` `<Readable>` | `<null>`
- `writable` `<Writable>` | `<null>`
- Returns: `<Duplex>`

## Example

```javascript
const { Readable, Writable, duplexify } = require('fluido')

const stream = duplexify(
  new Readable({
    read () {
      this.push('that')
      this.push(null)
    }
  }),
  new Writable({
    write (chunk, encoding, callback) {
      console.log('Write ' + chunk)
      callback()
    }
  })
)

// Logs 'Read that'
stream.on('data', data => console.log('Read ' + data))

// Logs 'Write this'
stream.write('this')
```
