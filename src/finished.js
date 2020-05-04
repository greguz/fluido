import stream from 'stream'
import { fromCallback } from 'universalify'

export const finished = fromCallback(stream.finished)
