<script lang="ts">
  import "../app.scss";
  import { Toaster } from "svelte-french-toast";
  import { Nav } from "../lib/ui/nav";
  import { Guide } from "../lib/ui/guide";
  import { app } from "../lib/state/app.state";
</script>

<main
  class="flex flex-col h-full md:overflow-y-hidden md:flex-row md:h-screen {$app.theme}"
  class:dark={$app.darkMode === true}
  class:light={$app.darkMode === false}
  on:dragover|preventDefault
>
  <Nav />
  <Guide>
    <slot />
  </Guide>
  <Toaster />
</main>

<style lang="scss">
  :global(main) {
    color: var(--text-color);
    font-family: var(--body-text);
    background: var(--background);
    @apply transition transform relative;
  }
</style>
