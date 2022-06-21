export function once (callback) {
  let called = false
  return function (err, res) {
    if (called) return
    called = true
    callback(err, res)
  }
}
