import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import sveltePreprocess from 'svelte-preprocess';


export default {
  // This `main.js` file we wrote
  input: './src/main.ts',
  output: {
    // The destination for our bundled JavaScript
    file: './public/build/bundle.js',
    // Our bundle will be an Immediately-Invoked Function Expression
    format: 'iife',
    // The IIFE return value will be assigned into a variable called `app`
    name: 'app',
    sourcemap: true,
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
      // Tell the svelte plugin where our svelte files are located
      include: './src/**/*.svelte',
    }),
    // Tell any third-party plugins that we're building for the browser
    resolve({ browser: true }),
    typescript()
  ],
};