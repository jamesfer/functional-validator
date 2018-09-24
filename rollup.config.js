import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import path from 'path';

const module = process.env.module || 'esm';
const target = process.env.target || 'es2015';

const file = module === 'umd' ? 'umd.js' : `${module}${target.replace(/^es/, '')}.js`;

const dependencies = Object.keys(require('./package.json').dependencies);

export default {
  input: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    file: path.resolve(__dirname, 'dist', file),
    format: module,
    name: 'fv',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      target,
      tsconfig: 'tsconfig.build.json',
    }),
  ],
  external: module === 'umd' ? [] : id => dependencies.includes(id) || /\/lodash-es\//.test(id),
  treeshake: {
    pureExternalModules: true,
  },
};
