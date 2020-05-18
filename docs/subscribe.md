# subscribe(source, ...transforms[, callback])

Same as `pipeline`, but will add a _Writable_ stream at the pipeline's end. The output will be the last collected chunk by the Writable.

- `source` `<Readable>`
- `...transforms` `<Duplex>`
- `callback` `<Function>`
- Returns: `<Promise>` Returns a `Promise` if `callback` is undefined.

## Example

```javascript
const { Readable, Transform, subscribe } = require('fluido')

function sum () {
  let result = 0
  return new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      result += chunk
      callback(null, result)
    }
  })
}

subscribe(
  Readable.from(new Array(100).fill(1)),
  sum(),
  (err, res) => {
    if (err) {
      console.error(err)
    } else {
      console.log(res) // Logs '100'
    }
  }
)
```
