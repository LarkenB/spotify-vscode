<script lang="ts">
  import { accessToken } from '../store';
  import Check from "svelte-material-icons/Check.svelte";
  import SkipNext from "svelte-material-icons/SkipNext.svelte";
  import Pause from "svelte-material-icons/Pause.svelte";
  import SkipPrevious from "svelte-material-icons/SkipPrevious.svelte";


  let currentTrack = null;

  const unsubscribe = accessToken.subscribe((value) => {
    if (!value) {
      currentTrack = null;
      return;
    };

    fetch(`https://api.spotify.com/v1/me/player`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${value}`,
      }
    }).then(async (response) => {
      const json = await response.json();
      currentTrack = json.currently_playing_type;
    })
	})
</script>

<style>

</style>


<p>TOKEN: {$accessToken}</p>
<Check />
<div>
  <SkipPrevious />
  <Pause />
  <SkipNext />
</div>
<p>CURRENT TRACK: {currentTrack}</p>