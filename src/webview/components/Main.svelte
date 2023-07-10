<script lang="ts">
  import { accessToken } from '../store';
  import Check from "svelte-material-icons/Check.svelte";
</script>

<style>

</style>


<p>TOKEN: {$accessToken}</p>
<Check />