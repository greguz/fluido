import { pipeline as impl } from 'readable-stream'
import { fromCallback } from 'universalify'

export const pipeline = fromCallback(impl)
