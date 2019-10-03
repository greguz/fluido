import { pipeline, PassThrough } from 'stream'

import { readable } from './readable'

import destroyStream from './internal/destroy'

export function readify (streams, options) {
  if (streams.length <= 0) {
    return readable(options)
  } else if (streams.length === 1) {
    return streams[0]
  }

  let source

  return readable({
    ...options,
    read () {
      // Restart data flow
      if (source) {
        source.resume()
        return
      }

      // Init our data source
      source = new PassThrough({ objectMode: true })

      // Data collect listener
      const listener = chunk => {
        if (!this.push(chunk)) {
          source.pause()
        }
      }

      // Setup pipeline
      pipeline(...streams, source, err => {
        source.off('data', listener)

        if (err) {
          this.emit('error', err)
        } else {
          this.push(null)
        }
      })

      // Start data flow
      source.on('data', listener)
    },
    destroy (err, callback) {
      callback(destroyStream(source, err))
    }
  })
}
