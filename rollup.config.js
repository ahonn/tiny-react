var babel =  require('rollup-plugin-babel')

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'React',
  plugins: [
    babel({
      sourceMap: true,
      exclude: 'node_modules/**'
    })
  ],
  dest: 'dist/tiny-react.js',
}
