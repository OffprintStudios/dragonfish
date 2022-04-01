<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { sidenav, close } from './sidenav.state';
</script>

<div class="flex-1 relative">
    {#if $sidenav.isOpen}
        <div class="absolute z-40 top-0 h-screen w-full flex">
            <div
                class="absolute z-30 bg-neutral-900 w-full h-screen opacity-75 backdrop-blur-md"
                transition:fade|local={{ delay: 0, duration: 100 }}
                on:click={close}
            />
            <div class="menu" transition:fly|local={{ delay: 0, duration: 200, x: -200 }}>
                <svelte:component this={$sidenav.component} />
            </div>
        </div>
    {/if}

    <slot />
</div>

<style lang="scss">
    div.menu {
        @apply h-screen z-40 relative min-w-full max-w-full md:min-w-[24rem] md:max-w-[24rem];
        background: var(--background);
    }
</style>
