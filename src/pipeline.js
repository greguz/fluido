import stream from 'readable-stream'
import { fromCallback } from 'universalify'

export const pipeline = fromCallback(stream.pipeline)

export const pump = pipeline
