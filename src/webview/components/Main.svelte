<script lang="ts">
  import { accessToken } from '../store';
  import Check from "svelte-material-icons/Check.svelte";
  import SkipNext from "svelte-material-icons/SkipNext.svelte";
  import Pause from "svelte-material-icons/Pause.svelte";
  import SkipPrevious from "svelte-material-icons/SkipPrevious.svelte";
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