import { pipeline } from 'stream'

import { isReadable, isDuplex } from './is'
import { readable } from './readable'

import { last } from './internal/utils'

export function readify (streams, options) {
  for (let i = 0; i < streams.length; i++) {
    if (i === 0) {
      if (!isReadable(streams[i])) {
        throw new TypeError('Expected readable stream')
      }
    } else {
      if (!isDuplex(streams[i])) {
        throw new TypeError('Expected duplex stream')
      }
    }
  }

  if (streams.length <= 0) {
    return readable(options)
  } else if (streams.length === 1) {
    return last(streams)
  }

  const source = last(streams)

  let cbDestroy

  return readable({
    ...options,
    read () {
      if (source.readableFlowing === null) {
        const listener = chunk => {
          if (!this.push(chunk)) {
            source.pause()
          }
        }

        pipeline(...streams, err => {
          source.removeListener('data', listener)

          if (cbDestroy) {
            cbDestroy(err)
          } else if (err) {
            this.emit('error', err)
          } else {
            this.push(null)
          }
        })

        source.addListener('data', listener)
      } else {
        source.resume()
      }
    },
    destroy (err, callback) {
      if (!cbDestroy) {
        cbDestroy = callback
        source.destroy(err)
      } else {
        callback(err)
      }
    }
  })
}
