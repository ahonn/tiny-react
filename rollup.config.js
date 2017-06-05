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
      dest: 'dist/svar.common.js',
      format: 'cjs'
    },
    {
      dest: 'dist/svar.js',
      format: 'umd',
      moduleName: 'svar'
    },
    {
      dest: 'example/simple/src/svar.js',
      format: 'cjs'
    }
  ]
}
