<script lang="ts">
    export let value = false;
</script>

<div
    class="flex flex-row items-center mt-3 mb-3 cursor-pointer"
    on:click={() => (value = !value)}
    tabindex="0"
>
    <div
        class="switch-container border border-zinc-700 dark:border-white w-12 h-6 flex items-center rounded-full"
        id="toggle"
    >
        <div
            class="switch w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"
            class:switch-activated={value}
        />
    </div>
    <label class="ml-3 select-none cursor-pointer text-sm" for="toggle"><slot /></label>
</div>

<style lang="scss">
    div.switch-container {
        background: transparent;
        padding: 0.2rem;
        cursor: pointer;
        div.switch {
            background: gray;
        }
        div.switch-activated {
            background: var(--accent);
            --tw-translate-x: 1.5rem /* 24px */;
        }
    }
</style>
