import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import sveltePreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/webview/main.ts',
  output: {
    file: 'dist/webview.js',
    format: 'iife',
    name: 'webview',
    sourcemap: true,
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        typescript: {
          tsconfigFile: './tsconfig.json',
        },
      }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    typescript(),
  ],
};
