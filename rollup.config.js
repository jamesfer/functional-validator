import path from 'path';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel'
import visualizer from 'rollup-plugin-visualizer';
import { uglify } from 'rollup-plugin-uglify';

const configurations = [
  { target: 'es2015', format: 'esm', minify: false },
  { target: 'es5', format: 'esm', minify: false },
  { target: 'es5', format: 'umd', minify: false },
  { target: 'es5', format: 'umd', minify: true },
];

export default ({ 'config-visualize': visualize }) => {
  const enabledConfigs = visualize ? [configurations[2]] : configurations;

  return enabledConfigs.map(({ target, format, minify }) => {
    const name = `${format}${target.replace('es', '')}.${minify ? 'min.' : ''}js`;
    return {
      input: path.resolve(__dirname, 'src', 'index.ts'),
      output: {
        format,
        file: path.resolve(__dirname, 'dist', name),
        sourcemap: true,
        // Name of global variable when using with a script tag
        name: 'fv',
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
        visualize ? visualizer({ open: true, sourcemap: true }) : [],
      ),
      treeshake: {
        // Assume all dependencies don't have side effects
        pureExternalModules: true,
      },
    };
  });
}
