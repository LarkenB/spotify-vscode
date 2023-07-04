<script>
  const vscode = acquireVsCodeApi();

  function handleClick() {
    vscode.postMessage({
      command: 'openSpotifyAuth',
    });
  }
</script>

<style>

</style>

<div class="container">
  <button on:click={handleClick}>Redirect to Spotify</button>
</div>
