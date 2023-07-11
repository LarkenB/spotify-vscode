<script lang="ts">
  import { accessToken, currentTrack } from '../store';
  import Check from "svelte-material-icons/Check.svelte";
  import IconButton from '@smui/icon-button';
  import { onMount, onDestroy } from 'svelte';

  async function pause() {
    if (!$accessToken) return;

    fetch(`https://api.spotify.com/v1/me/player/pause`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${$accessToken}`,
      }
    });
  }

  async function skipToNext() {
    if (!$accessToken) return;

    await fetch(`https://api.spotify.com/v1/me/player/next`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${$accessToken}`,
      }
    });

    getCurrentTrack();
  }

  async function skipToPrevious() {
    if (!$accessToken) return;

    await fetch(`https://api.spotify.com/v1/me/player/previous`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${$accessToken}`,
      }
    });

    getCurrentTrack();
  }

  async function getCurrentTrack() {
    if (!$accessToken) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${$accessToken}`,
        }
      });

      switch(response.status) {
        case 200: {
          currentTrack.set((await response.json()).item as Track);
          return;
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  async function updatePlaybackState() {
    if (!$accessToken) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${$accessToken}`,
        }
      });

      switch(response.status) {
        case 200: {
          currentTrack.set((await response.json()).item as Track);
          return;
        }
        case 204: {
          // Playback not available or active
          return;
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  let intervalId;

  onMount(() => {
    intervalId = setInterval(getCurrentTrack, 5000);
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
  <IconButton on:click={skipToPrevious} class="material-icons" ripple={false}>
    skip_previous
  </IconButton>
  <IconButton on:click={pause} class="material-icons" ripple={false}>
    pause
  </IconButton>
  <IconButton on:click={skipToNext} class="material-icons" ripple={false}>
    skip_next
  </IconButton>
</div>
<p>CURRENT TRACK: {$currentTrack?.name}</p>