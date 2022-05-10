<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { close, guide } from '$lib/ui/guide/guide.state';
</script>

<div class="flex-1 relative">
    {#if $guide.open}
        <div class="absolute z-40 top-0 h-screen w-full flex">
            <div
                class="absolute z-30 bg-black w-full h-screen bg-opacity-50"
                transition:fade|local={{ delay: 0, duration: 100 }}
                on:click={close}
            ><!--backdrop--></div>
            <div class="guide" transition:fly|local={{ delay: 0, duration: 200, x: -200 }}>
                {#key $guide.currPage}
                    <div in:fly|local={{ delay: 0, duration: 200, x: -200 }}>
                        <svelte:component this={$guide.routing[$guide.currPage]} />
                    </div>
                {/key}
            </div>
        </div>
    {/if}

    <slot />
</div>

<style lang="scss">
    div.guide {
        @apply h-screen z-40 relative min-w-full max-w-full md:min-w-[24rem] rounded-r-2xl overflow-hidden;
        box-shadow: var(--dropshadow);
        background: var(--background);
    }
</style>