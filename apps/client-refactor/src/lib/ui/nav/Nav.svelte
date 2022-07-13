<script lang="ts">
  import { navigating, page } from "$app/stores";
  import {
    CloseLine,
    Compass3Line,
    Home5Line,
    LoginCircleLine,
    Menu2Fill,
    SearchEyeLine,
    Settings5Line,
    TeamLine
  } from "svelte-remixicon";
  import { close, guide, open } from "../guide";
  import { LoginPanel } from "../guide/registration";
  import { SettingsHomePanel } from "../guide/settings";
  import { MobilePanel } from "../guide/mobile";

  enum MenuOptions {
    NoMenu,
    AccountMenu,
    CreateMenu,
    MobileMenu,
    InboxMenu,
    RegistrationMenu,
    SettingsMenu,
  }

  let currentMenu = MenuOptions.NoMenu;
  $: {
    if (!$guide.open) {
      currentMenu = MenuOptions.NoMenu;
    }
  }

  function toggleMenu(menuOption: MenuOptions) {
    currentMenu = menuOption;
    switch (currentMenu) {
      case MenuOptions.AccountMenu:
        //open(UserMenu);
        break;
      case MenuOptions.CreateMenu:
        //open(ContentMenu);
        break;
      case MenuOptions.InboxMenu:
        //open(InboxMenu);
        break;
      case MenuOptions.MobileMenu:
        open(MobilePanel);
        break;
      case MenuOptions.RegistrationMenu:
        open(LoginPanel);
        break;
      case MenuOptions.SettingsMenu:
        open(SettingsHomePanel);
        break;
      default:
        close();
        break;
    }
  }

  navigating.subscribe((val) => {
    if (val !== null) {
      currentMenu = MenuOptions.NoMenu;
      close();
    }
  });
</script>

<div class="navbar">
  <!--Desktop Navigation-->
  <div class="py-2 flex-col items-center h-full hidden md:flex">
    {#if currentMenu === MenuOptions.RegistrationMenu}
      <button
        class="link"
        class:active={currentMenu === MenuOptions.RegistrationMenu}
        on:click={() => toggleMenu(MenuOptions.NoMenu)}
      >
        <span class="link-icon"><CloseLine size="24px" /></span>
        <span class="link-name">Close</span>
      </button>
    {:else}
      <button
        class="link"
        on:click={() => toggleMenu(MenuOptions.RegistrationMenu)}
      >
        <span class="link-icon"><LoginCircleLine size="24px" /></span>
        <span class="link-name">Log In</span>
      </button>
    {/if}
    <div class="w-10/12 mx-auto border-b border-white my-2"><!--separator--></div>
    <a
      class="link"
      class:active={$page.url.pathname === '/'  && currentMenu === MenuOptions.NoMenu}
      href="/"
    >
      <span class="link-icon"><Home5Line size="24px" /></span>
      <span class="link-name">Home</span>
    </a>
    <a
      class="link"
      class:active={$page.url.pathname.startsWith('/search') && currentMenu === MenuOptions.NoMenu}
      href="/search"
    >
      <span class="link-icon"><SearchEyeLine size="24px" /></span>
      <span class="link-name">Search</span>
    </a>
    <a
      class="link"
      class:active={$page.url.pathname.startsWith('/explore') && currentMenu === MenuOptions.NoMenu}
      href="/explore"
    >
      <span class="link-icon"><Compass3Line size="24px" /></span>
      <span class="link-name">Explore</span>
    </a>
    <a
      class="link"
      class:active={$page.url.pathname.startsWith('/social') && currentMenu === MenuOptions.NoMenu}
      href="/social"
    >
      <span class="link-icon"><TeamLine size="24px" /></span>
      <span class="link-name">Social</span>
    </a>
    <div class="flex-1"><!--fill space--></div>
    <div class="w-10/12 mx-auto border-b border-white my-2"><!--separator--></div>
    {#if currentMenu === MenuOptions.SettingsMenu}
      <button
        class="link"
        class:active={currentMenu === MenuOptions.SettingsMenu}
        on:click={() => toggleMenu(MenuOptions.NoMenu)}
      >
        <span class="link-icon"><CloseLine size="24px" /></span>
        <span class="link-name">Close</span>
      </button>
    {:else}
      <button
        class="link"
        on:click={() => toggleMenu(MenuOptions.SettingsMenu)}
      >
        <span class="link-icon"><Settings5Line size="24px" /></span>
        <span class="link-name">Settings</span>
      </button>
    {/if}
  </div>

  <!--Mobile Navigation-->
  <div class="flex items-center p-1 md:hidden">
    {#if currentMenu === MenuOptions.MobileMenu}
      <button
        class="link-mobile"
        class:active={currentMenu === MenuOptions.MobileMenu}
        on:click={() => toggleMenu(MenuOptions.NoMenu)}
      >
        <span class="link-icon"><CloseLine size="24px" /></span>
      </button>
    {:else}
      <button
        class="link-mobile"
        on:click={() => toggleMenu(MenuOptions.MobileMenu)}
      >
        <span class="link-icon"><Menu2Fill size="24px" /></span>
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
      <span class="link-icon"><SearchEyeLine size="24px" /></span>
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
  button.link,
  div.link {
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
