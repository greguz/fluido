import { transform } from './transform'
import { readable } from './readable'
import { pump } from './pump'

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
      if (source) {
        source.resume()
        return
      }

      source = transform({ objectMode: true })

      const listener = chunk => {
        if (!this.push(chunk)) {
          source.pause()
        }
      }

      source.addListener('data', listener)

      pump(...streams, source, err => {
        source.removeListener('data', listener)

        if (err) {
          this.emit('error', err)
        } else {
          this.push(null)
        }
      })
    },
    destroy (err, callback) {
      callback(destroyStream(source, err))
    }
  })
}
