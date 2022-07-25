<script lang="ts">
  import { navigating, page } from "$app/stores";
  import {
    Book2Line,
    BookOpenFill,
    CloseLine,
    Compass3Fill,
    Compass3Line,
    Home5Fill,
    Home5Line,
    LayoutMasonryFill,
    LayoutMasonryLine,
    Menu2Fill,
    SearchEyeFill,
    SearchEyeLine,
    TeamFill,
    TeamLine,
    UserHeartFill,
    UserHeartLine
  } from "svelte-remixicon";
  import { close, guide, open } from "../guide";
  import { MobilePanel } from "../guide/mobile";
  import { account } from "../../state/account.state.js";

  const iconSize = "24px";

  navigating.subscribe((val) => {
    if (val !== null) {
      close();
    }
  });
</script>

<div class="navbar">
  <!--Desktop Navigation-->
  <div class="py-2 flex-col items-center h-full hidden md:flex">
    {#if $guide.routing.length > 0}
      <button
        class="link"
        class:active={$guide.routing.length > 0}
        on:click={close}
      >
        <span class="link-icon"><BookOpenFill size={iconSize} /></span>
        <span class="link-name">Close</span>
      </button>
    {:else}
      <button
        class="link"
        on:click={open}
      >
        <span class="link-icon"><Book2Line size={iconSize} /></span>
        <span class="link-name">Guide</span>
      </button>
    {/if}
    <div class="w-10/12 mx-auto border-b border-white my-2"><!--separator--></div>
    {#if $account.currProfile}
      <a
        class="link"
        class:active={$page.url.pathname === '/library'  && $guide.routing.length === 0}
        href="/library"
      >
      <span class="link-icon">
        {#if $page.url.pathname === '/library'}
          <LayoutMasonryFill size={iconSize} />
        {:else}
          <LayoutMasonryLine size={iconSize} />
        {/if}
      </span>
        <span class="link-name">Library</span>
      </a>
      <a
        class="link"
        class:active={$page.url.pathname === '/follows'  && $guide.routing.length === 0}
        href="/follows"
      >
      <span class="link-icon">
        {#if $page.url.pathname === '/follows'}
          <UserHeartFill size={iconSize} />
        {:else}
          <UserHeartLine size={iconSize} />
        {/if}
      </span>
        <span class="link-name">Follows</span>
      </a>
      <div class="w-10/12 mx-auto border-b border-white my-2"><!--separator--></div>
    {/if}
    <a
      class="link"
      class:active={$page.url.pathname === '/'  && $guide.routing.length === 0}
      href="/"
    >
      <span class="link-icon">
        {#if $page.url.pathname === '/'}
          <Home5Fill size={iconSize} />
        {:else}
          <Home5Line size={iconSize} />
        {/if}
      </span>
      <span class="link-name">Home</span>
    </a>
    <a
      class="link"
      class:active={$page.url.pathname.startsWith('/search') && $guide.routing.length === 0}
      href="/search"
    >
      <span class="link-icon">
        {#if $page.url.pathname === '/search'}
          <SearchEyeFill size={iconSize} />
        {:else}
          <SearchEyeLine size={iconSize} />
        {/if}
      </span>
      <span class="link-name">Search</span>
    </a>
    <a
      class="link"
      class:active={$page.url.pathname.startsWith('/explore') && $guide.routing.length === 0}
      href="/explore"
    >
      <span class="link-icon">
        {#if $page.url.pathname === '/explore'}
          <Compass3Fill size={iconSize} />
        {:else}
          <Compass3Line size={iconSize} />
        {/if}
      </span>
      <span class="link-name">Explore</span>
    </a>
    <a
      class="link"
      class:active={$page.url.pathname.startsWith('/social') && $guide.routing.length === 0}
      href="/social"
    >
      <span class="link-icon">
        {#if $page.url.pathname === '/social'}
          <TeamFill size={iconSize} />
        {:else}
          <TeamLine size={iconSize} />
        {/if}
      </span>
      <span class="link-name">Social</span>
    </a>
  </div>

  <!--Mobile Navigation-->
  <div class="flex items-center p-1 md:hidden">
    {#if $guide.routing.length > 0}
      <button
        class="link-mobile"
        class:active={$guide.routing.length > 0}
        on:click={close}
      >
        <span class="link-icon"><CloseLine size={iconSize} /></span>
      </button>
    {:else}
      <button
        class="link-mobile"
        on:click={() => open(MobilePanel)}
      >
        <span class="link-icon"><Menu2Fill size={iconSize} /></span>
      </button>
    {/if}
    <a href="/" class="flex-1">
      <img
        src="/images/logo.png"
        alt="logo"
        class="relative z-30 max-w-[8rem] mx-auto"
      />
    </a>
    <a href="/search" class="link-mobile select-none cursor-pointer group">
      <span class="link-icon"><SearchEyeLine size={iconSize} /></span>
    </a>
  </div>
</div>

<style lang="scss">
  div.navbar {
    @apply w-full md:h-screen md:w-[75px] z-50 relative;
    background: var(--accent);
    box-shadow: var(--dropshadow);
  }

  a.link,
  button.link {
    @apply p-2 mx-2 mb-1 border-2 border-transparent rounded-lg transition transform text-white flex flex-col items-center justify-center w-[61px] h-[61px] relative;
    &:hover {
      @apply no-underline scale-105;
      box-shadow: var(--dropshadow);
      background: var(--accent-light);
      color: white;
      border-color: white;
    }

    &:active {
      @apply scale-105;
    }

    &.active {
      @apply no-underline shadow-xl;
      background: var(--accent-light);
      color: white;
      border-color: white;
    }

    span.link-name {
      @apply text-[0.6rem] uppercase font-bold tracking-wider;
    }
  }

  div.link {
    img {
      @apply block object-cover;
      width: 57px;
      height: 57px;
    }
  }

  a.link-mobile,
  button.link-mobile {
    @apply block p-2 rounded-lg text-white transition transform flex flex-col items-center justify-center w-[50px] h-[50px] relative;
  }
</style>
