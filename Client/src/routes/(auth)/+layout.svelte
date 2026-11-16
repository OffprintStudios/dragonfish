<script lang="ts">
	import { LinkBlock } from '#lib/ui/misc';
    import { IconX } from '@tabler/icons-svelte';
	import type { LayoutProps } from '../$types';
    import Mountains from '#lib/assets/images/mountains.jpg';

    let { children }: LayoutProps = $props();
</script>

<div
    class="flex flex-col items-center justify-center w-full h-screen bg-cover bg-center relative z-0"
    style={`background-image: url(${Mountains})`}
>
    <div class="absolute top-4 left-4 hidden md:block">
        <LinkBlock
            id="back-button"
            title="Go Back"
            href="/"
        >
            <span class="link-icon no-text text-zinc-300"><IconX size="32px" /></span>
        </LinkBlock>
    </div>

    {@render children()}
</div>