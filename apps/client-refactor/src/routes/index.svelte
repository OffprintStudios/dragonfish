<script lang="ts">
  import { DEFAULT_SLOGANS } from "../lib/models/util";

  let currSlogan = DEFAULT_SLOGANS[Math.floor(Math.random() * DEFAULT_SLOGANS.length)];
</script>

<svelte:head>
  <title>Home &mdash; Offprint</title>
  <!-- Primary Meta Tags -->
  <meta name="title" content="Offprint" />
  <meta name="description" content="A next-generation publishing and community platform." />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://offprint.net/" />
  <meta property="og:title" content="Offprint" />
  <meta
    property="og:description"
    content="A next-generation publishing and community platform."
  />
  <meta property="og:image" content="/images/offprint_icon.png" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://offprint.net/" />
  <meta property="twitter:title" content="Offprint" />
  <meta
    property="twitter:description"
    content="A next-generation publishing and community platform."
  />
  <meta property="twitter:image" content="/images/offprint_icon.png" />
</svelte:head>

<div class="w-full mb-6">
  <div class="home-header">
    <img
      src="/images/logo.png"
      alt="logo"
      style="max-width: 24rem; margin: 0 auto;"
      class="relative z-30"
    />
    <h2 class="text-white font-light text-2xl relative z-30">{currSlogan}</h2>
  </div>
</div>

<style lang="scss">
  div.home-header {
    @apply text-white text-center py-2 w-full hidden md:flex flex-col items-center justify-center;
    background: var(--accent);
  }
</style>