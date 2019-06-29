import { Readable } from 'stream'
import { handle } from './handle'

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

        handle(...sources, err => {
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
        source.destroy(err)
      }
      callback(err)
    }
  })
}
