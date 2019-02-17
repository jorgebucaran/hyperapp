import replace from 'rollup-plugin-replace';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/hyperapp.js',
    format: 'umd',
    name: 'hyperapp',
    sourcemap: true
  },
  plugins: [
    replace({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
    })
  ]
}
