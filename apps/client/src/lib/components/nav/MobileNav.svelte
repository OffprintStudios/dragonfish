<script lang="ts">
    import { navigating } from '$app/stores';
    import {
        CloseLine,
        SearchEyeLine,
        MenuLine,
    } from 'svelte-remixicon';
    import { open, close, sidenav } from '$lib/components/nav/sidenav/sidenav.state';
    import UserMenu from '$lib/components/ui/user/UserMenu.svelte';
    import { session } from '$lib/repo/session.repo';
    import InboxMenu from '$lib/components/ui/user/InboxMenu.svelte';
    import ContentMenu from '../ui/user/ContentMenu.svelte';
    import { useQuery } from '@sveltestack/svelte-query';
    import { fetchAllUnread } from '$lib/services/activity.service';
    import MobileMenu from '$lib/components/nav/MobileMenu.svelte';

    enum MenuOptions {
        NoMenu,
        UserMenu,
        CreateMenu,
        MobileMenu,
        InboxMenu,
    }

    let currentMenu = MenuOptions.NoMenu;
    $: {
        if (!$sidenav.isOpen) {
            currentMenu = MenuOptions.NoMenu;
        }
    }

    function toggleMenu(menuOption: MenuOptions) {
        currentMenu = menuOption;
        switch (currentMenu) {
            case MenuOptions.UserMenu:
                open(UserMenu);
                break;
            case MenuOptions.CreateMenu:
                open(ContentMenu);
                break;
            case MenuOptions.InboxMenu:
                open(InboxMenu);
                break;
            case MenuOptions.MobileMenu:
                open(MobileMenu);
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

    const activity = useQuery('unreadActivity', () => fetchAllUnread($session.currProfile._id), {
        enabled: !!$session.currProfile,
        cacheTime: 1000 * 60 * 0.25,
    });
</script>

<div class="navbar">
    <div class="p-1 flex items-center block md:hidden">
        {#if currentMenu === MenuOptions.MobileMenu}
            <div
                class="link-mobile select-none cursor-pointer group"
                class:active={currentMenu === MenuOptions.MobileMenu}
                on:click={() => toggleMenu(MenuOptions.NoMenu)}
            >
                <span class="link-icon"><CloseLine size="24px" /></span>
            </div>
        {:else}
            <div
                class="link-mobile select-none cursor-pointer group"
                class:active={currentMenu === MenuOptions.MobileMenu}
                on:click={() => toggleMenu(MenuOptions.MobileMenu)}
            >
                <span class="link-icon"><MenuLine size="24px" /></span>
            </div>
        {/if}
        <!-- <a href="/" class="flex-1">
            <img
                src="/images/logo.png"
                alt="logo"
                style="max-width: 8rem; margin: 0 auto;"
                class="relative z-30"
            />
        </a> -->
        <div
            style="max-width: 8rem; margin: 0 auto;"
            class="relative z-30"
        />
        <a href="/search" class="link-mobile select-none cursor-pointer group">
            <span class="link-icon"><SearchEyeLine size="24px" /></span>
        </a>
    </div>
</div>

<style lang="scss">
    div.navbar {
        @apply w-full absolute;
    }

    a.link-mobile,
    div.link-mobile {
        @apply block p-2 z-50 rounded-lg text-white transition transform flex flex-col items-center justify-center w-[50px] h-[50px];
    }
</style>
