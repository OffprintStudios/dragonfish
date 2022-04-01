<script lang="ts">
    export let value = false;
    export let id = 'Radio'
    export let group = undefined;
</script>

<div class="flex items-center mx-2 my-1 cursor-pointer" tabindex="0">
    <input class="radio border-zinc-700 dark:border-white" type="radio" id="{id}" bind:group {value}>
    <label for="{id}"><slot/></label>
</div>

<style lang="scss">
    input.radio {
        @apply bg-transparent mr-1.5;
        &:hover {
            @apply bg-zinc-500;
        }
        &:checked {
            background-color: var(--accent);
            @apply border-none;
        }
    }
    label {
        @apply text-sm md:text-base;
    }
</style>