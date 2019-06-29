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

      reading = false

      const ended = data === null || this._readableState.ended === true
      if (!ended) {
        if (this.push(data)) {
          this._read(size)
        }
      }
    })
  }
}
