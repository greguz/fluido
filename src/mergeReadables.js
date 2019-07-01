import { Readable } from 'stream'

import { _handle } from './handle'

import destroyStream from './internal/destroy'

export function mergeReadables (sources, options) {
  let listener

  return new Readable({
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

        _handle(sources, { writable: false }, err => {
          for (const source of sources) {
            source.off('data', listener)
          }

          if (err) {
            this.emit('error', err)
          } else {
            this.push(null)
          }
        })

        for (const source of sources) {
          source.on('data', listener)
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
