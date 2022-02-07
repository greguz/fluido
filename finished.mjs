import { finished as impl } from 'readable-stream'
import { fromCallback } from 'universalify'

export const finished = fromCallback(impl)
