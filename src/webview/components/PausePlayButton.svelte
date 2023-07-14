<script lang="ts">
  import { accessToken } from '../store';
  import IconButton from '@smui/icon-button';
  import { getCurrentTrack, pause } from '../spotify/endpoints'

  async function onPause() {
    await pause($accessToken);
    getCurrentTrack($accessToken);
  }

</script>

<IconButton on:click={onPause} class="material-icons" ripple={false}>
    pause
</IconButton>