<script lang="ts">
    import { page } from '$app/stores';
    import PageNav from '$lib/components/nav/PageNav.svelte';
    import {
        Settings5Line,
        Apps2Line,
        ShieldUserLine,
        UserSettingsLine,
        GroupLine,
        NotificationBadgeLine,
    } from 'svelte-remixicon';
    import { session } from '$lib/repo/session.repo';
</script>

<svelte:head>
    <title>Settings &mdash; Offprint</title>
</svelte:head>

<div
    class="flex flex-col md:flex-row w-full min-h-screen md:h-screen overflow-y-auto md:overflow-y-hidden"
>
    <PageNav>
        <svelte:fragment slot="header">
            <h3>Settings</h3>
            <Settings5Line />
        </svelte:fragment>
        <svelte:fragment slot="pages">
            <a href="/settings" class:active={$page.url.pathname === '/settings'}>
                <span class="link-icon"><Apps2Line /></span>
                <span class="text">General</span>
            </a>
            {#if $session.token}
                <a
                    href="/settings/account"
                    class:active={$page.url.pathname === '/settings/account'}
                >
                    <span class="link-icon"><ShieldUserLine /></span>
                    <span class="text">Account</span>
                </a>
                <a
                    href="/settings/profile"
                    class:active={$page.url.pathname === '/settings/profile'}
                >
                    <span class="link-icon"><UserSettingsLine /></span>
                    <span class="text">Profile</span>
                </a>
                <a href="/settings/social" class:active={$page.url.pathname === '/settings/social'}>
                    <span class="link-icon"><GroupLine /></span>
                    <span class="text">Social</span>
                </a>
                <a
                    href="/settings/notifications"
                    class:active={$page.url.pathname === '/settings/notifications'}
                >
                    <span class="link-icon"><NotificationBadgeLine /></span>
                    <span class="text">Notifications</span>
                </a>
            {/if}
        </svelte:fragment>
    </PageNav>
    <div class="w-full md:overflow-y-auto">
        <slot />
    </div>
</div>
