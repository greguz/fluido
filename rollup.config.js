export default {
  input: 'src/index.js',
  output: {
    file: 'index.js',
    format: 'cjs'
  },
  external: ['events', 'stream', 'end-of-stream']
}
