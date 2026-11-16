<script lang="ts">
	import type { Snippet } from "svelte";
    import { IconLoader2 } from "@tabler/icons-svelte";

    interface Props {
        id: string;
        title: string;
        type?: 'button' | 'submit' | 'reset';
        primary?: boolean;
        active?: boolean;
        loading?: boolean;
        loadingText?: string;
        disabled?: boolean;
        fullWidth?: boolean;
        onclick?: (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => void;
        children: Snippet;
    }

    let {
        id,
        title,
        type = 'button',
        primary = false,
        active = false,
        loading = false,
        loadingText = undefined,
        disabled = false,
        fullWidth = false,
        onclick,
        children,
    }: Props = $props();
</script>

<button
    {id}
    {title}
    {type}
    class="btn"
    class:primary={primary}
    class:active={active}
    class:w-full={fullWidth}
    disabled={disabled || loading}
    {onclick}
>
    {#if loading}
        <span class="button-icon animate-spin"><IconLoader2 /></span>
        <span class="button-text">{loadingText}</span>
    {:else}
        {@render children()}
    {/if}
</button>