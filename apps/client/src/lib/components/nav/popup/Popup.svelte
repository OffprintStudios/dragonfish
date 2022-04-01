<script lang="ts">
    import { scale } from 'svelte/transition';
    import { popup, closePopup } from './popup.state';
    import { app } from '$lib/repo/app.repo';
</script>

{#if $popup.isOpen}
    <div
        class="absolute z-[100] w-full h-screen {$app.theme}"
        class:dark={$app.darkMode === true}
        class:light={$app.darkMode === false}
        transition:scale={{ delay: 0, duration: 200 }}
        on:dragover|preventDefault
    >
        <div class="click-to-close" on:click={closePopup}><!--backdrop--></div>
        <div class="popup-container">
            <svelte:component this={$popup.component} />
        </div>
    </div>
{/if}

<style lang="scss">
    div.popup-container {
        @apply relative z-[110] w-fit;
        margin: 50vh auto 0;
        transform: translateY(-50%);
        color: var(--text-color);
    }
    div.click-to-close {
        @apply absolute z-[100] w-full h-screen;
    }
</style>
