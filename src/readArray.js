import { readable } from './readable'

export function readArray (arr, options) {
  if (!Array.isArray(arr)) {
    return readable()
  }
  let index = 0
  return readable({
    ...options,
    objectMode: true,
    read () {
      let flowing = true
      while (flowing && index < arr.length) {
        flowing = this.push(arr[index++])
      }
      if (index >= arr.length) {
        this.push(null)
      }
    }
  })
}
