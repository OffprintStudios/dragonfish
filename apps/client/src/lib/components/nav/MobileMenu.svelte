<script lang="ts">
    import { Home5Line, Compass3Line, TeamLine, Settings5Line } from 'svelte-remixicon';
</script>

<div class="flex flex-col w-full h-screen overflow-y-auto">
    <div class="menu-header">
        <a href="/registration" class="login-link">Log In / Sign Up</a>
    </div>
    <div class="my-4 flex-1 w-full px-4">
        <a href="/" class="menu-link border-zinc-600 dark:border-white">
            <span><Home5Line size="24px" class="mr-1" /></span>
            <span>Home</span>
        </a>
        <a href="/explore" class="menu-link border-zinc-600 dark:border-white">
            <span><Compass3Line size="24px" class="mr-1" /></span>
            <span>Explore</span>
        </a>
        <a href="/social" class="menu-link border-zinc-600 dark:border-white">
            <span><TeamLine size="24px" class="mr-1" /></span>
            <span>Social</span>
        </a>
        <a href="/settings" class="menu-link border-zinc-600 dark:border-white">
            <span><Settings5Line size="24px" class="mr-1" /></span>
            <span>Settings</span>
        </a>
    </div>
</div>

<style lang="scss">
    div.menu-header {
        @apply px-4 py-6 flex items-center w-full mb-4;
        background: var(--accent);
        a.login-link {
            @apply text-white text-center text-sm uppercase font-bold tracking-widest w-full;
        }
    }
    a.menu-link {
        @apply flex items-center justify-center p-6 w-full border rounded-lg w-full mb-4 no-underline;
        color: var(--text-color);
        &:hover {
            @apply text-white;
            background: var(--accent);
        }
    }
</style>
