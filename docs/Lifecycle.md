# Lifecycle

These functions are useful to inspect or control the lifecycle of streams.

## eos(stream, options, callback)

- stream `<Stream>`
  Target stream to inspect.
- options `<Object>`
  - readable `<Boolean>`
    When set to `false`, the *callback* will be called
    when the stream ends even though the stream might still be readable.
    Default: `true`.
  - writable `<Boolean>`
    When set to `false`, the *callback* will be called
    when the stream ends even though the stream might still be writable.
    Default: `true`.
  - error `<Boolean>`
    If set to `false`, then a call to `emit('error', err)`
    is not treated as finished.
    Default: `true`.
- callback `<Function>`
  A callback function that takes an optional error argument.
- Returns: `<Function>`
  A cleanup function that removes all registered listeners.

Registers an **e**nd-**o**f-**s**tream callback, which is called when a stream
is no longer readable, writable or has experienced an error
or a premature close event.

```javascript
// End of reading
eos(readable, err => { })

// End of writing
eos(writable, err => { })

// Both end of reading and writing
eos(duplex, err => { })

// Just the end of reading
eos(duplex, { writable: false }, err => { })
```

## finished(...streams, callback)

- streams `<...Stream>`
  Array of streams to inspect.
- callback `<Function>`
  A callback function that takes an optional error argument.
- Returns: `<Function>`
  A cleanup function that removes all registered listeners.

Same features of its [eos](#eosstream-options-callback) counterpart,
but supporting multiple streams.

```javascript
const { finished } = require('fluido')
const { createReadStream, createWriteStream } = require('fs')

const source = createReadStream('/home/mom/images/cat.jpg')
const target = createWriteStream('/home/grandma/images/cat.jpg')

finished(source, target, err => {
  // All streams are closed now
  if (err) {
    // Handle error
  } else {
    // All done
  }
})

source.pipe(target)
```

It is also possible to use [eos options](#eosstream-options-callback)
by wrapping both the stream and the required options into an array.

```javascript
finished(
  // Just the end of reading
  [duplex, { readable: false }],
  // End of writing
  writable,
  callback
)
```

## handle(...streams, callback)

- streams `<...Stream>`
  Array of streams to handle.
- callback `<Function>`
  A callback function that takes an optional error argument.
- Returns: `<Function>`
  A cleanup function that removes all registered listeners.

Similar to [finished](#finishedstreams-callback), but destroying the
streams at the first first encountered error.

## pump(...streams, callback)

- streams `<...Stream>`
  A pipeable chain of streams.
- callback `<Function|undefined>`
  A callback function that takes an optional error argument.
- Returns: `<undefined|Promise>`
  If *callback* is `undefined` returns a Promise.

Pipes between streams forwarding errors and properly cleaning up
and provide a callback when the pipeline is complete.

```javascript
const { pump } = require('fluido')
const { createReadStream, createWriteStream } = require('fs')
const sharp = require('sharp')

pump(
  // Read source image
  createReadStream('cat.jpg'),
  // Process image data
  sharp().resize(200, 200).png(),
  // Write target image
  createWriteStream('cat.png'),
  // Final callback
  err => {
    if (err) {
      // Handle error
    } else {
      // And they live happily ever after
    }
  }
)
```

## subscribe(...streams, callback)

- streams `<...Stream>`
  A pipeable chain of streams.
- callback `<Function|undefined>`
  A callback function that takes an optional error argument.
- Returns: `<undefined|Promise>`
  If *callback* is `undefined` returns a Promise.

Pump streams and fire the callback with the last value emitted by the pipeline
as second argument.
If callback is `undefined`, returns a promise.

```javascript
const { collect, subscribe } = require('fluido')
const { createReadStream } = require('fs')
const sharp = require('sharp')

subscribe(
  // Read the source image
  createReadStream('cat.jpg'),
  // Process image data
  sharp().resize(200, 200).png(),
  // Collect all chunks into a single buffer
  collect('buffer'),
  // Final callback
  (err, buffer) => {
    if (err) {
      // Handle error
    } else {
      // Do something with the resulting image buffer
    }
  }
)
```
