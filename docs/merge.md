# merge([options, ]...streams)

Merge multiple streams into a single one.

- `options` `<Object>`
- `...streams` `<Stream>`
- Returns: `<Duplex>`

## Example

```javascript
const { merge, pipeline } = require('fluido')
const { createReadStream, createWriteStream } = require('fs')
const JSONStream = require('JSONStream')

const source = merge(
  { objectMode: true },
  readFromDatabaseA({ type: 'animals' }),
  readFromDatabaseB({ type: 'animals' }),
  readFromDatabaseC({ type: 'animals' })
)

const target = merge(
  createWritableStream('/home/harry/animals.json'),
  createWritableStream('/home/ron/animals.json'),
  createWritableStream('/home/hermione/animals.json')
)

pipeline(
  source,
  JSONStream.stringify(),
  target,
  err => {
    // TODO: handle error
  }
)
```
