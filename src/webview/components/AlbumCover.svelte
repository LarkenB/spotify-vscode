<script lang="ts">
    export let src: string;

</script>

<style>
    img {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 10px;
    }
</style>

<img src={src} alt={'ALBUM COVER'} />