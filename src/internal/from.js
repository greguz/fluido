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

      const flowing = this.push(data)
      const ended = data === null || this._readableState.ended === true
      if (!ended && flowing) {
        this._read(size)
      }
    })
  }
}
