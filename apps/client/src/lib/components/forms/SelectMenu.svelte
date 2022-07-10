<script lang="ts">
    // TODO: adjust styles for site

    import { fade } from 'svelte/transition';
    import Select from 'svelte-select';

    export let items;
    export let value = null;
    export let placeholder = 'Select items...';
    export let isClearable = false;
    export let label = '';
    export let isMulti = false;
    export let errorMessage = null;
</script>


<label
    class="text-[0.625rem] relative z-20 top-[0.15rem] left-1 py-0.5 px-1 rounded-t-lg font-semibold tracking-wider uppercase"
    >{label}</label
>
<Select
    {items}
    {value}
    {placeholder}
    {isClearable}
    {isMulti}
    class="offprint-select"
    on:select
    on:change
/>

{#if !!errorMessage}
    <span
        class="text-[0.625rem] text-red-500 relative -top-1 left-2"
        transition:fade|local={{ delay: 0, duration: 350 }}>{errorMessage}</span
    >
{:else}
    <span
        class="text-[0.625rem] text-red-500 relative -top-1 left-2"
        transition:fade|local={{ delay: 0, duration: 350 }}>&nbsp;</span
    >
{/if}


<style lang="scss">
    :global(.list) {
        // themes.scss variables not available
        // background: var(--select-bg) !important;
        border-radius: 0.6rem !important;
        // border: 1px solid var(--borders) !important;
        z-index: 100 !important;

        :global(.item) {
            cursor: pointer;
        }

        // :global(.item.active) {
        //     background: var(--accent-light) !important;
        // }

        // :global(.item.hover) {
        //     background: var(--accent) !important;
        // }
    }

    :global(.offprint-select) {
        // theme.scss variables available, but can't set list attributes
        color: var(--text-color) !important;
        border-radius: 0.5rem !important;
        background: var(--select-bg) !important;
        border-top: 1px solid transparent !important;
        border-left: 1px solid transparent !important;
        border-right: 1px solid transparent !important;
        border-bottom: 4px solid transparent !important;

        :global(.multi-item) {
            color: white !important;
            background: var(--accent) !important;
            font-size: 0.875rem !important;
        }

        :global(&.focused) {
            border-color: var(--borders) !important;
        }

        :global(input[type='text']:focus) {
            border-color: transparent !important;
        }
    }
</style>
