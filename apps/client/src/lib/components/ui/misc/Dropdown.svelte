<script lang="ts">
    import { computePosition, flip, offset, Placement, shift } from '@floating-ui/dom';
    import { slide } from 'svelte/transition';
    import { Button } from '$lib/components/ui/misc';
    import { clickOutside } from '$lib/util';

    export let kind: 'primary' | 'normal' = 'normal';
    export let position: Placement = 'bottom-start';
    let open = false;

    function determineOpenState() {
        open = !open;
    }

    let button: HTMLButtonElement = null;
    let dropdown: HTMLDivElement = null;

    $: {
        if (button) {
            computePosition(button, dropdown, {
                placement: position,
                middleware: [offset({ mainAxis: 6 }), flip(), shift({ padding: 5 })]
            }).then(({ x, y }) => {
                Object.assign(dropdown.style, {
                    left: `${x}px`,
                    top: `${y}px`
                })
            }).catch(() => {
                console.log(`Button not yet assigned!`);
            })
        }
    }
</script>

<div class="relative">
    <Button
        kind={kind === 'normal' ? 'normal' : 'primary'}
        isActive={open}
        on:click={determineOpenState}
        bind:thisButton={button}
    >
        <slot name="button" />
    </Button>
    {#if open}
        <div
            class="dropdown-items"
            transition:slide|local="{{ delay: 0, duration: 250 }}"
            bind:this={dropdown}
            use:clickOutside
            on:outclick={determineOpenState}
        >
            <slot name="items" />
        </div>
    {/if}
</div>

<style lang="scss">
    :global(div.dropdown-items) {
        @apply absolute rounded-lg z-10 p-1 min-w-[12rem] max-w-[24rem] bg-zinc-300;
        box-shadow: var(--dropshadow);
        :global(a), :global(button) {
            @apply flex items-center w-full p-2 rounded-lg transition transform no-underline hover:bg-zinc-400;
            color: var(--text-color);
            :global(span) {
                @apply text-sm;
            }
        }
        :global(div.divider) {
            @apply w-11/12 mx-auto my-2 border-b;
        }
    }

    :global(.dark div.dropdown-items) {
        @apply bg-zinc-700;
        :global(a), :global(button) {
            @apply hover:bg-zinc-600;
        }
    }
</style>
