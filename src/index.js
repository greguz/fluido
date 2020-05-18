import stream from 'readable-stream'
import { fromCallback } from 'universalify'

export { PassThrough } from 'readable-stream'

const finished = fromCallback(stream.finished)
const pipeline = fromCallback(stream.pipeline)
export { finished, pipeline }

export { collect } from './collect'
export { Duplex } from './Duplex'
export { duplexify } from './duplexify'
export * from './is'
export { Readable } from './Readable'
export { readify } from './readify'
export { subscribe } from './subscribe'
export { Transform } from './Transform'
export { Writable } from './Writable'
export { writify } from './writify'
