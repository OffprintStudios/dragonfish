<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { CheckboxCircleFill, CheckboxBlankCircleLine } from 'svelte-remixicon';

    export let value = false;
    export let size = '24px';

    const dispatch = createEventDispatcher();

    function toggle() {
        value = !value;
        dispatch('check');
    }
</script>

<div class="flex items-center w-fit" tabindex="0">
    {#if value === true}
        <div on:click={toggle}>
            <CheckboxCircleFill {size} />
        </div>
    {:else}
        <div on:click={toggle}>
            <CheckboxBlankCircleLine {size} />
        </div>
    {/if}
    <div>
        <slot />
    </div>
</div>
