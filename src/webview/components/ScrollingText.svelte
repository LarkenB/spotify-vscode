<script lang="ts">
    import { onMount } from 'svelte';
    import Marquee from 'svelte-fast-marquee';
  
    export let text: string;
    let isScrolling = false;
    let h1Element: HTMLHeadingElement;
    let parentDiv: HTMLDivElement;

    onMount(() => {
        const resizeObserver = new ResizeObserver(entries => {
            // We're only watching one element
            const entry = entries.at(0);

            const divWidth = entry.contentBoxSize[0].inlineSize;
            const h1Width = h1Element ? h1Element.clientWidth : 0;

            console.log(`div: ${divWidth}`);
            console.log(`h1: ${h1Width}`);

            isScrolling = h1Width > divWidth;
        });

        resizeObserver.observe(parentDiv);

        // This callback cleans up the observer
        return () => resizeObserver.unobserve(parentDiv);
    });

</script>
  
<div bind:this={parentDiv} style="width: 100%;">
{#if isScrolling}
    <Marquee direction='right' play={true}>
        <h1 class="text" bind:this={h1Element}>{text}</h1>
    </Marquee>
{:else}
    <h1 style="white-space: nowrap; width: fit-content;" class="text" bind:this={h1Element}>{text}</h1>
{/if }
</div>