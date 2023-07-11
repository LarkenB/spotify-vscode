<script lang="ts">
  import { accessToken } from '../store';
  import Check from "svelte-material-icons/Check.svelte";
  import SkipNext from "svelte-material-icons/SkipNext.svelte";
  import Pause from "svelte-material-icons/Pause.svelte";
  import SkipPrevious from "svelte-material-icons/SkipPrevious.svelte";
  import IconButton from '@smui/icon-button';


  function skipToNext() {
    if (!$accessToken) return;

    fetch(`https://api.spotify.com/v1/me/player/next`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${$accessToken}`,
      }
    });
  }

  function skipToPrevious() {
    if (!$accessToken) return;

    fetch(`https://api.spotify.com/v1/me/player/previous`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${$accessToken}`,
      }
    });
  }

  let currentTrack: Track | null = null;

  accessToken.subscribe(async (value) => {
    if (!value) {
      currentTrack = null;
      return;
    };

    const response = await fetch(`https://api.spotify.com/v1/me/player`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${value}`,
      }
    });

    switch(response.status) {
      case 200: {
        currentTrack = (await response.json()).item as Track;
        return;
      }
      case 204: {
        // Playback not available or active
        return;
      }
      case 401: {
        // Bad or expired token
        return;
      }
      case 403: {
        // Bad OAuth request
        return;
      }
      case 429: {
        // The app has exceeded its rate limits.
        return;
      }
    }
	});
</script>

<style>

</style>


<p>TOKEN: {$accessToken}</p>
<Check />
<div>
  <IconButton on:click={skipToPrevious} class="material-icons" ripple={false}>skip_previous</IconButton>
  <IconButton class="material-icons" ripple={false}>pause</IconButton>
  <IconButton on:click={skipToNext} class="material-icons" ripple={false}>skip_next</IconButton>
</div>
<p>CURRENT TRACK: {currentTrack?.name}</p>