<script>
    let message = 'Hello, World!';

    function handleClick() {
      message = 'Button clicked!';
    }
</script>
  
<style>
    
</style>
  
  <div class="container">
    <h1>{message}</h1>
    <button on:click={handleClick}>Click Me</button>
  </div>
  