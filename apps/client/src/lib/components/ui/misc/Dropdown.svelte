<script lang="ts">
    import { ArrowDownSLine } from 'svelte-remixicon';

    export let open = false;
    export let kind: 'primary' | 'normal' = 'normal';
</script>

<div class="relative">
    <div class="flex items-start">
        <button
            class="main rounded-l-lg"
            type="button"
            class:primary={kind === 'primary'}
            class:active={open}
            on:click
        >
            <slot name="button" />
        </button>
        <button class="side rounded-r-lg h-full" on:click={() => (open = !open)}>
            <ArrowDownSLine class="button-icon" />
        </button>
    </div>
    {#if open}
        <div class="absolute rounded-lg z-10 top-[100%] p-2" style="background: var(--background);">
            <slot name="items" />
        </div>
    {/if}
</div>

<style lang="scss">
    button.main {
        @apply flex items-center px-2 py-1.5 transition transform focus:ring-0 m-0 text-base select-none;
        text-transform: lowercase;
        font-variant: small-caps;
        font-weight: 700;
        letter-spacing: 1px;
        color: var(--text-color);

        &.primary,
        &.active {
            @apply text-white;
            background: var(--accent);
            &:hover {
                background: var(--accent-light);
            }
        }

        &.primary.active {
            @apply text-white;
            background: var(--accent-light);
        }

        &.disabled {
            @apply text-zinc-500 cursor-not-allowed;
            &:hover,
            &:active {
                color: var(--text-color);
                background: transparent;
                text-decoration: none;
                @apply scale-100;
            }
        }

        &.primary.disabled {
            @apply cursor-not-allowed;
            color: var(--accent-dark);
            &:hover,
            &:active {
                color: var(--accent-dark);
                background: var(--accent);
                text-decoration: none;
                @apply scale-100;
            }
        }

        &:hover {
            color: white;
            background: var(--accent);
            text-decoration: none;
            @apply scale-105;
        }

        &:active {
            @apply text-white scale-100 cursor-pointer shadow-inner;
            background: var(--accent-dark);
        }

        :global(svg.button-icon) {
            @apply mr-1.5 relative;
        }

        :global(svg.button-icon.no-text) {
            @apply mr-0;
        }

        :global(span.button-text) {
            @apply relative -top-0.5;
        }
    }

    button.side {
        @apply flex items-center px-1 py-2 transition transform focus:ring-0 m-0 text-base select-none;
        &:hover {
            color: white;
            background: var(--accent);
            text-decoration: none;
            @apply scale-105;
        }
        &:active {
            @apply text-white scale-100 cursor-pointer shadow-inner;
            background: var(--accent-dark);
        }
    }
</style>
