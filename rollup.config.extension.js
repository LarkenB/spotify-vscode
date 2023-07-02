import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/extension/extension.ts',
  output: {
    file: 'dist/extension.js',
    format: 'cjs',
    sourcemap: 'inline',
  },
  external: [
    'vscode',
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
  ],
};
