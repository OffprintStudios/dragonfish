<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { CheckboxBlankCircleLine, CheckboxCircleFill } from "svelte-remixicon";

  export let value = false;
  export let size = '24px';

  const dispatch = createEventDispatcher();

  function toggle() {
    value = !value;
    dispatch('check');
  }
</script>

<div class="flex w-fit my-2" tabindex="0">
  {#if value === true}
    <div style="color: var(--accent);" class="text-white transition transform" on:click={toggle}>
      <CheckboxCircleFill {size} />
    </div>
  {:else}
    <div class="transition transform" on:click={toggle}>
      <CheckboxBlankCircleLine {size} />
    </div>
  {/if}
  <div class="text-sm relative top-[0.15rem] ml-2">
    <slot />
  </div>
</div>