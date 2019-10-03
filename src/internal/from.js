export default function from (read) {
  let reading = false

  return function wrappedRead (size) {
    if (reading) {
      return
    }
    reading = true

    read.call(this, size, (err, data) => {
      if (err) {
        process.nextTick(() => this.emit('error', err))
        return
      }
      if (this._readableState && this._readableState.ended) {
        // Closed by someone
        return
      }

      reading = data === null
      if (this.push(data) && !reading) {
        this._read(size)
      }
    })
  }
}
