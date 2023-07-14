<script lang="ts">
  import { accessToken, playbackState } from '../store';
  import IconButton from '@smui/icon-button';
  import { getCurrentTrack, pause } from '../spotify/endpoints'

  async function onPause() {
    await pause($accessToken);
    getCurrentTrack($accessToken);
  }

  let isPlaying: boolean;

  $: {
    if ($playbackState) {
      isPlaying = $playbackState.is_playing
    }
  }
</script>

{#if isPlaying}
<IconButton on:click={onPause} class="material-icons" ripple={false}>
  pause
</IconButton>
{:else}
<IconButton class="material-icons" ripple={false}>
  play_arrow
</IconButton>
{/if}