<script lang="ts">
	import type { Snippet } from "svelte";

    interface Props {
        id: string;
        title: string;
        href: string;
        primary?: boolean;
        fullWidth?: boolean;
        children: Snippet
    }

    let { id, title, href, primary = false, fullWidth = false, children }: Props = $props();
</script>

<a
    class="lnk"
    {id}
    {title}
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    {href}
    class:primary={primary}
    class:w-full={fullWidth}
>
    {@render children()}
</a>
