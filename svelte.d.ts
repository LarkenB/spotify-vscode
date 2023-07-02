import type { SvelteComponent } from 'svelte';

declare module '*.svelte' {
  export default SvelteComponent;
}