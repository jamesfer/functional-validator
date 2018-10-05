import path from 'path';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

const dependencies = Object.keys(require('./package.json').dependencies);
const configurations = [
  { module: 'umd', target: 'es5' },
  { module: 'umd', target: 'es5', minify: true },
  { module: 'esm', target: 'es5' },
  { module: 'esm', target: 'es2015' },
];

function name(module, target, minify) {
  const ext = `${minify ? 'min.' : ''}js`;
  const name = module === 'umd' ? 'umd' : `${module}${target.replace(/^es/, '')}`;
  return `${name}.${ext}`;
}

export default configurations.map(({ module, target, minify }) => ({
  input: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    file: path.resolve(__dirname, 'dist', name(module, target, minify)),
    format: module,
    sourcemap: true,
    // Name of global variable when using with a script tag
    name: 'fv',
    // Skip default export when not using esm
    exports: module === 'esm' ? 'auto' : 'named',
    // Skip emitting interop helper function
    interop: false,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      target,
      tsconfig: 'tsconfig.build.json',
    }),
  ].concat(
    minify ? uglify() : [],
  ),
  // Mark dependencies as external when not making a umd bundle
  external: module === 'umd' ? [] : id => dependencies.includes(id) || /\/lodash-es\//.test(id),
  treeshake: {
    // Assume all dependencies don't have side effects
    pureExternalModules: true,
  },
}));
