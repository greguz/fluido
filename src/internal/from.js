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

      const ended = this._readableState.ended === true

      const flowing = data === undefined
        ? this.readableFlowing === true
        : this.push(data)

      if (!ended && flowing) {
        this._read(size)
      }
    })
  }
}
