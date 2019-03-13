export function read() {
  this.push(null)
}

export function write(chunk, encoding, callback) {
  callback()
}

export function transform(chunk, encoding, callback) {
  this.push(chunk, encoding)
  callback()
}
