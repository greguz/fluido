export default {
  input: 'fluido.mjs',
  output: {
    file: 'fluido.cjs',
    format: 'cjs'
  },
  external: ['readable-stream', 'universalify', 'util']
}
