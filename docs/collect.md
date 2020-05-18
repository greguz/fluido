# collect([target])

Creates a Transform stream that collects all chunks and joins them in different ways. May emits a buffer, string or an array containing all collected chunks.

- `target` `<String>`
  - `'buffer'` Emits single `Buffer`.
  - `'string'` Emits string value.
  - `'array'` Emits an array containing all collected chunks.
  - `undefined` Auto mode.
- Returns: `<Transform>`

## Example

```javascript
const { createReadStream } = require('fs')
const { collect, subscribe } = require('fluido')

subscribe(
  createReadStream(__filename),
  collect('string'),
  (err, file) => {
    if (err) {
      console.error(err)
    } else {
      console.log(`Source code for file ${__filename}:`)
      console.log(file)
    }
  }
)
```
