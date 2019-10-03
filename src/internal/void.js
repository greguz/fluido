export function voidRead () {
  this.push(null)
}

export function voidWrite (_chunk, _encoding, callback) {
  callback()
}

export function voidTransform (chunk, _encoding, callback) {
  this.push(chunk)
  callback()
}
