<script lang="ts">
  import { accessToken, currentTrack } from '../store';
  import Check from "svelte-material-icons/Check.svelte";
  import IconButton from '@smui/icon-button';
  import { onMount, onDestroy } from 'svelte';
  import { pause, getCurrentTrack, skipToPrevious, skipToNext } from '../spotify/endpoints'

  async function onPause() {
    await pause($accessToken);
    getCurrentTrack($accessToken);
  }

  async function onSkipToNext() {
    await skipToNext($accessToken);
    getCurrentTrack($accessToken);
  }

  async function onSkipToPrevious() {
    await skipToPrevious($accessToken);
    getCurrentTrack($accessToken);
  }

  let intervalId;

  onMount(() => {
    intervalId = setInterval(async () => {
      currentTrack.set(await getCurrentTrack($accessToken))
    }, 5000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<style>

</style>

<svelte:head>
  <!-- Fonts -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
  />

  <!-- Material Typography -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/@material/typography@14.0.0/dist/mdc.typography.css"
  />

  <!-- SMUI -->
  <link rel="stylesheet" href="https://unpkg.com/svelte-material-ui/bare.css" />
</svelte:head>

<p>TOKEN: {$accessToken}</p>
{#if $currentTrack}
  <img src={$currentTrack.album.images[0].url} alt={$currentTrack.name} />
{:else}
<p>NO CURRENT TRACK</p>
{/if}
<div>
  <IconButton on:click={onSkipToPrevious} class="material-icons" ripple={false}>
    skip_previous
  </IconButton>
  <IconButton on:click={onPause} class="material-icons" ripple={false}>
    pause
  </IconButton>
  <IconButton on:click={onSkipToNext} class="material-icons" ripple={false}>
    skip_next
  </IconButton>
</div>
<p>CURRENT TRACK: {$currentTrack?.name}</p>