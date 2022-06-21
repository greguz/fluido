import stream from 'readable-stream'

export function finished (...args) {
  return typeof args[args.length - 1] === 'function'
    ? stream.finished(...args)
    : stream.promises.finished(...args)
}
