export default {
  input: 'src/index.js',
  output: {
    file: 'fluido.js',
    format: 'cjs'
  },
  external: ['readable-stream', 'util']
}
