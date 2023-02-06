import test from 'ava'

import * as fluido from './fluido.mjs'

test('exports', t => {
  t.true(typeof fluido.Duplex === 'function')
  t.true(typeof fluido.PassThrough === 'function')
  t.true(typeof fluido.Readable === 'function')
  t.true(typeof fluido.Stream === 'function')
  t.true(typeof fluido.Transform === 'function')
  t.true(typeof fluido.Writable === 'function')
  t.true(typeof fluido.addAbortSignal === 'function')
  t.true(typeof fluido.asCallback === 'function')
  t.true(typeof fluido.compose === 'function')
  t.true(typeof fluido.finished === 'function')
  t.true(typeof fluido.isCallback === 'function')
  t.true(typeof fluido.isDuplexStream === 'function')
  t.true(typeof fluido.isErrored === 'function')
  t.true(typeof fluido.isNodeStream === 'function')
  t.true(typeof fluido.isReadable === 'function')
  t.true(typeof fluido.isReadableStream === 'function')
  t.true(typeof fluido.isWritableStream === 'function')
  t.true(typeof fluido.pipeline === 'function')
})
