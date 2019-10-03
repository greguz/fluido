import { readable } from './readable'
import { handle } from './handle'

import destroyStream from './internal/destroy'

function setStreamOptions (streams) {
  return streams.map(stream => [stream, { readable: true, writable: false }])
}

export function mergeReadables (sources, options) {
  if (!Array.isArray(sources)) {
    throw new TypeError('Expected array of streams')
  }

  let listener

  return readable({
    ...options,
    read () {
      if (!listener) {
        listener = data => {
          if (!this.push(data)) {
            for (const source of sources) {
              source.pause()
            }
          }
        }

        handle(...setStreamOptions(sources), err => {
          for (const source of sources) {
            source.removeListener('data', listener)
          }

          if (err) {
            this.emit('error', err)
          } else {
            this.push(null)
          }
        })

        for (const source of sources) {
          source.addListener('data', listener)
        }
      } else {
        for (const source of sources) {
          source.resume()
        }
      }
    },
    destroy (err, callback) {
      for (const source of sources) {
        err = destroyStream(source, err)
      }
      callback(err)
    }
  })
}
