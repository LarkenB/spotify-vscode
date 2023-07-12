<script lang="ts">
    import { accessToken } from '../store';
    import IconButton from '@smui/icon-button';
    import { getCurrentTrack, skipToNext } from '../spotify/endpoints'

  async function onSkipToNext() {
    await skipToNext($accessToken);
    getCurrentTrack($accessToken);
  }

</script>

<IconButton on:click={onSkipToNext} class="material-icons" ripple={false}>
    skip_next
</IconButton>