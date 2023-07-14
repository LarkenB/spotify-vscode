<script lang="ts">
  import { accessToken, currentTrack } from '../store';
  import { onMount, onDestroy } from 'svelte';
  import { getCurrentTrack } from '../spotify/endpoints'
  import PreviousButton from './PreviousButton.svelte';
  import NextButton from './NextButton.svelte';
  import PausePlayButton from './PausePlayButton.svelte';
  import AlbumCover from './AlbumCover.svelte';
  import ScrollingText from './ScrollingText.svelte';

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
  <AlbumCover src={$currentTrack.album.images[0].url} />
  <ScrollingText> 
    <h1>{$currentTrack.name}</h1>
  </ScrollingText>
  <p>{$currentTrack.artists[0].name}</p>
{:else}
  <p>NO CURRENT TRACK</p>
{/if}
<div>
  <PreviousButton />
  <PausePlayButton />
  <NextButton />
</div>
<p>CURRENT TRACK: {$currentTrack?.name}</p>