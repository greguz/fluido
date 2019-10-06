export function voidRead () {
  this.push(null)
}

export function voidWrite (chunk, encoding, callback) {
  callback(null)
}

export function voidTransform (chunk, encoding, callback) {
  callback(null, chunk)
}
