<script lang="ts">
  import { fade } from "svelte/transition";

  export let name = 'text';
    export let type = 'text';
    export let title = 'Text Input';
    export let placeholder = 'Text Input';
    export let value = null;
    export let errorMessage;
</script>

<div class="text-field">
    <label
        for={name}
        class="text-[0.625rem] relative z-20 top-[0.15rem] left-1 py-0.5 px-1 rounded-t-lg font-semibold tracking-wider uppercase"
    >
        {title}
    </label>
    <input
        id={name}
        {type}
        {name}
        {title}
        {placeholder}
        {value}
        class="bg-zinc-300 dark:bg-zinc-700 dark:placeholder-zinc-400 dark:highlight-shadowed"
        class:error={!!errorMessage}
        on:change
        on:keypress
    />
    {#if !!errorMessage && errorMessage !== ''}
        <span
            class="text-[0.625rem] text-red-500 relative -top-1 left-2"
            transition:fade|local={{ delay: 0, duration: 350 }}>{errorMessage}</span
        >
    {/if}
</div>

<style lang="scss">
    div.text-field {
        @apply w-full my-2 relative z-10 rounded-lg border-b-2 border-transparent overflow-hidden;

        input {
            @apply w-full relative px-3 pt-3 pb-2.5 border-b-2 rounded-lg border-transparent transition;
            &:focus {
                @apply ring-0 shadow-md;
                border-bottom: 2px solid var(--borders);
            }

            &.error {
                @apply border-b-2 border-red-500;
            }
        }
    }
</style>
