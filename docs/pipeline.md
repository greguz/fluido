# pipeline(source[, ...transforms], target[, callback])

A module method to pipe between streams and generators forwarding errors and properly cleaning up and provide a callback when the pipeline is complete.

- `source` `<Readable>`
- `...transforms` `<Duplex>`
- `target` `<Writable>`
- `callback` `<Function>`
- Returns: `<Writable>` | `<Promise>` Last stream in pipeline or a `Promise` if `callback` is `undefined`.
