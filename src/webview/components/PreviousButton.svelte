<script lang="ts">
    import { accessToken } from '../store';
    import IconButton from '@smui/icon-button';
    import { getCurrentTrack, skipToPrevious } from '../spotify/endpoints'

  async function onSkipToPrevious() {
    await skipToPrevious($accessToken);
    getCurrentTrack($accessToken);
  }

</script>

<IconButton on:click={onSkipToPrevious} class="material-icons" ripple={false}>
    skip_previous
</IconButton>