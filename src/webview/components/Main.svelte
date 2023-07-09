<script>
  const vscode = acquireVsCodeApi();

  let accessToken = ''

  window.addEventListener('message', event => {
    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        case 'access-token':
            console.log(`TOKEN: ${message.accessToken}`);
            accessToken = message.accessToken;
            break;
    }
  });


</script>

<style>

</style>


<p>TOKEN: {accessToken}</p>
