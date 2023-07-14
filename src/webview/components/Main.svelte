<script lang="ts">
  import { accessToken, currentTrack, playbackState } from '../store';
  import { onMount, onDestroy } from 'svelte';
  import { getCurrentTrack, updatePlaybackState } from '../spotify/endpoints'
  import PreviousButton from './PreviousButton.svelte';
  import NextButton from './NextButton.svelte';
  import PausePlayButton from './PausePlayButton.svelte';
  import AlbumCover from './AlbumCover.svelte';
  import ScrollingText from './ScrollingText.svelte';
  import ShuffleButton from './ShuffleButton.svelte';
  import RepeatButton from './RepeatButton.svelte';
  import Scrubber from './Scrubber.svelte';

  let playbackIntervalId;
  let trackIntervalId;

  onMount(() => {
    // Poll for entire playback state every 5 seconds
    playbackIntervalId = setInterval(async () => {
      playbackState.set(await updatePlaybackState($accessToken));
    }, 5000);

    // Poll for current track every second
    trackIntervalId = setInterval(async () => {
      currentTrack.set(await getCurrentTrack($accessToken));
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(playbackIntervalId);
    clearInterval(trackIntervalId);
  });
</script>

<!--<p>TOKEN: {$accessToken}</p>-->
{#if $currentTrack}
  <AlbumCover src={$currentTrack.album.images[0].url} />
  <ScrollingText> 
    <h1 style="margin: 0;">{$currentTrack.name}</h1>
  </ScrollingText>
  <p style="margin: 0;">{$currentTrack.artists.map((artist) => artist.name).join(', ')}</p>
{:else}
  <p>NO CURRENT TRACK</p>
{/if}
<div style="display: flex; justify-content: center; gap: 10px;">
  <ShuffleButton />
  <PreviousButton />
  <PausePlayButton />
  <NextButton />
  <RepeatButton />
</div>
<Scrubber />

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