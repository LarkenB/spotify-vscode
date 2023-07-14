
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Slider from '@smui/slider';
    import { currentTrack, playbackState } from '../store';
  
    let progress_ms = 0;
    let duration_ms = 1;
    $: value = Math.min(progress_ms / duration_ms * 100, 100);

    $: {
        if ($playbackState) {
            progress_ms = $playbackState.progress_ms;
        }
    }

    $: {
        if ($currentTrack) {
            duration_ms = $currentTrack.duration_ms;
        }
    }

    // TODO: update with css rather than interval
    let intervalId;

    onMount(() => {
        intervalId = setInterval(async () => {
            if ($playbackState && $playbackState.is_playing && value < 100) {
                duration_ms += 1000;
            }
        }, 1000);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });

</script>

<Slider style="flex-grow: 1;" bind:value />
  