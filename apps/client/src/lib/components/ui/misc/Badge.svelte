<script lang="ts">
    export let hasValue = true;
    export let positioning: 'top-left' | 'top-right' | 'no-position' = 'no-position';
</script>

<div
    class="badge"
    class:top-left={positioning === 'top-left'}
    class:top-right={positioning === 'top-right'}
>
    {#if hasValue}
        <slot />
    {/if}
</div>

<style lang="scss">
    div.badge {
        @apply rounded-full py-0.5 px-1.5 border text-xs text-white bg-red-400;
        &.top-left {
            @apply absolute -top-1.5 -left-1.5;
        }
        &.top-right {
            @apply absolute -top-1.5 -right-1.5;
        }
    }
</style>
