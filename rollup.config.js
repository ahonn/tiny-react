const babel =  require('rollup-plugin-babel')
const includePaths = require('rollup-plugin-includepaths')

export default {
  entry: 'src/index.js',
  plugins: [
    babel({
      sourceMap: true,
      exclude: 'node_modules/**'
    }),
    includePaths()
  ],
  targets: [
    {
      dest: 'dist/tiny-react.common.js',
      format: 'cjs'
    },
    {
      dest: 'dist/tiny-react.js',
      format: 'umd',
      moduleName: 'svar'
    },
    {
      dest: 'example/simple/src/tiny-react.js',
      format: 'cjs'
    }
  ]
}
