import path from 'path';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify';
import { plugin as analyze } from 'rollup-plugin-analyzer';

const configurations = [
  { target: 'es2015', format: 'esm', minify: false },
  { target: 'es5', format: 'esm', minify: false },
  { target: 'es5', format: 'umd', minify: false },
  { target: 'es5', format: 'umd', minify: true },
];

export default configurations.map(({ target, format, minify }) => {
  const name = `${format}${target.replace('es', '')}.${minify ? 'min.' : ''}js`;
  return {
    input: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
      format,
      file: path.resolve(__dirname, 'dist', name),
      sourcemap: true,
      // Name of global variable when using with a script tag
      name: 'fv',
      // Skip default export when not using esm
      exports: 'named',
      // Skip emitting interop helper function
      interop: false,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ target, tsconfig: 'tsconfig.build.json' }),
      babel({ extensions: ['.ts'] }),
    ].concat(
      minify ? uglify() : [],
    ),
    treeshake: {
      // Assume all dependencies don't have side effects
      pureExternalModules: true,
    },
  };
});
