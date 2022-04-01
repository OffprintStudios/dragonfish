<script lang="ts">
    import { LoginCircleLine, UserAddLine } from 'svelte-remixicon';
    import { session } from '$lib/repo/session.repo';
    import LogInForm from '$lib/components/ui/user/LogInForm.svelte';
    import RegisterForm from '$lib/components/ui/user/RegisterForm.svelte';
    import { goto } from '$app/navigation';

    enum RegistrationTabs {
        LogIn,
        Register,
    }

    let selectedTab = RegistrationTabs.LogIn;

    function onSuccess() {
        if ($session.profiles.length === 0) {
            goto('/registration/create-profile');
        } else {
            goto('/registration/select-profile');
        }
    }
</script>

<div class="flex flex-col h-full">
    <div class="header">
        <button
            on:click={() => (selectedTab = RegistrationTabs.LogIn)}
            class:active={selectedTab === RegistrationTabs.LogIn}
        >
            <span class="button-icon"><LoginCircleLine /></span>
            <span class="button-text">Log In</span>
        </button>
        <div class="mx-1" />
        <button
            on:click={() => (selectedTab = RegistrationTabs.Register)}
            class:active={selectedTab === RegistrationTabs.Register}
        >
            <span class="button-icon"><UserAddLine /></span>
            <span class="button-text">Register</span>
        </button>
    </div>
    <div class="body">
        {#if selectedTab === RegistrationTabs.LogIn}
            <LogInForm on:login={onSuccess} />
        {:else if selectedTab === RegistrationTabs.Register}
            <RegisterForm on:register={onSuccess} />
        {/if}
    </div>
</div>

<style lang="scss">
    div.header {
        @apply w-full flex items-center justify-center py-4;
        background: var(--accent);
        button {
            @apply text-white flex items-center py-2 px-4 transition transform rounded-lg border border-white;
            span.button-icon {
                @apply mr-2;
            }
            &:hover,
            &.active {
                background: var(--accent-light);
            }
            &:hover {
                @apply scale-105;
            }
            &:active {
                @apply scale-100;
            }
        }
    }
    div.body {
        @apply p-4 overflow-y-auto;
    }
</style>
