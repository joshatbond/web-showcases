const postcssJitProps = require('postcss-jit-props')
const OpenProps = require('open-props')
const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [autoprefixer, postcssJitProps(OpenProps)],
}
