<script lang="ts">
	export let pauseOnHover = false
	export let pauseOnClick = false
	export let direction = 'left'
	export let speed = 100
	let play = false

	let containerWidth;
    let marqueeWidth;

    $: play = marqueeWidth > containerWidth;

	$: duration = containerWidth / speed;

	$: _style = `
		--pause-on-hover: ${pauseOnHover ? 'paused' : 'running'};
		--pause-on-click: ${pauseOnClick ? 'paused' : 'running'};
	`

	$: _marqueeStyle = `
		--play: ${play ? 'running' : 'paused'};
		--direction: ${direction === 'left' ? 'normal' : 'reverse'};
		--duration: ${duration}s;
	`

</script>

<div class="marquee-container" style={_style}  bind:clientWidth={containerWidth}>
	<div class={play ? 'marquee' : 'static'} style={_marqueeStyle}>
        <div bind:clientWidth={marqueeWidth}>
            <slot />
        </div>
	</div>
    {#if play}
        <div class="marquee" style={_marqueeStyle}>
		    <slot />
	    </div>
    {/if}
</div>

<style>
.marquee-container {
	display: flex;
	width: 100%;
	overflow-x: hidden;
	flex-direction: row;
	position: relative;
}

.marquee-container:hover .marquee {
	animation-play-state: var(--pause-on-hover);
}

.marquee-container:active .marquee {
	animation-play-state: var(--pause-on-click);
}

.static {
    flex: 0 0 auto;
	min-width: 100%;
	z-index: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.marquee {
	flex: 0 0 auto;
	min-width: 100%;
	z-index: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
    padding-left: 10px;
	animation: scroll var(--duration) linear 0s infinite;
	animation-play-state: var(--play);
	animation-direction: normal;
	animation-direction: var(--direction);
}

@keyframes scroll {
	0% {
		transform: translateX(0%);
	}
	100% {
		transform: translateX(-100%);
	}
}
</style>
  