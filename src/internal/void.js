export function noSource () {
  this.push(null)
}

export function noTarget (chunk, encoding, callback) {
  callback(null)
}

export function passthrough (chunk, encoding, callback) {
  callback(null, chunk)
}
