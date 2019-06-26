export function voidRead () {
  this.push(null)
}

export function voidWrite (chunk, encoding, callback) {
  callback()
}

export function voidTransform (chunk, encoding, callback) {
  this.push(chunk, encoding)
  callback()
}
