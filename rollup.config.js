import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import path from 'path';

const dependencies = Object.keys(require('./package.json').dependencies);
const configurations = [
  { module: 'umd', target: 'es5' },
  { module: 'umd', target: 'es5' },
  { module: 'esm', target: 'es5' },
  { module: 'esm', target: 'es2015' },
];

function name(module, target) {
  return module === 'umd' ? 'umd.js' : `${module}${target.replace(/^es/, '')}.js`;
}

export default configurations.map(({ module, target }) => ({
  input: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    file: path.resolve(__dirname, 'dist', name(module, target)),
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
  ],
  // Mark dependencies as external when not making a umd bundle
  external: module === 'umd' ? [] : id => dependencies.includes(id) || /\/lodash-es\//.test(id),
  treeshake: {
    // Assume all dependencies don't have side effects
    pureExternalModules: true,
  },
}));
