import stream from 'readable-stream'
import { fromCallback } from 'universalify'

export const finished = fromCallback(stream.finished)

export const eos = finished
