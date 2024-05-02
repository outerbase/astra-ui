import commonjs from '@rollup/plugin-commonjs'
import multi from '@rollup/plugin-multi-entry'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

export default {
  input: 'dist/js/bundle.js',
  output: {
    name: 'Astra', // Name of the global variable to hold the module's default export
    file: 'dist/web-components/astra.js',
    format: 'iife', // "iife" format for a self-executing function, suitable for inclusion as a <script> tag
  },
  plugins: [
    multi(),
    resolve(), // Resolves node modules
    commonjs(), // Converts CommonJS modules to ES6, so they can be included in a Rollup bundle
    terser(), // Minifies the bundle
  ],
}
