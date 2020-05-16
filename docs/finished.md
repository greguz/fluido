# finished(stream[, options][, callback])

A function to get notified when a stream is no longer readable, writable or has experienced an error or a premature close event.

- `stream` `<Stream>` A readable and/or writable stream.
- `options` `<Object>`
  - `error` `<Boolean>` If set to `false`, then a call to `emit('error', err)` is not treated as finished. Default: `true`.
  - `readable` `<Boolean>` When set to `false`, the callback will be called when the stream ends even though the stream might still be readable. Default: `true`.
  - `writable` `<Boolean>` When set to `false`, the callback will be called when the stream ends even though the stream might still be writable. Default: `true`.
- `callback` `<Function>`
- Returns: `<Function>` | `<Promise>` A cleanup function which removes all registered listeners, or a `Promise` if `callback` is `undefined`.

## Example

```javascript
const { finished } = require('fluido');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('Stream failed.', err);
  } else {
    console.log('Stream is done reading.');
  }
});

rs.resume(); // Drain the stream.
```
