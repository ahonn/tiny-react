var babel =  require('rollup-plugin-babel')

export default {
  entry: 'src/index.js',
  plugins: [
    babel({
      sourceMap: true,
      exclude: 'node_modules/**'
    })
  ],
  targets: [
    {
      dest: 'dist/tiny-react.common.js',
      format: 'cjs'
    },
    {
      dest: 'dist/tiny-react.js',
      format: 'umd',
      moduleName: 'TintReact'
    },
    {
      dest: 'example/simple/src/tiny-react.js',
      format: 'cjs'
    }
  ]
}
