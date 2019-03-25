import { finished as _finished } from 'stream'

import { isStream } from './is'

export function finished (stream, callback) {
  if (callback === undefined) {
    return new Promise((resolve, reject) =>
      finished(stream, err => (err ? reject(err) : resolve()))
    )
  }

  if (!isStream(stream)) {
    callback(new TypeError('Expected a stream'))
  } else {
    _finished(stream, callback)
  }
}
