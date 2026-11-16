<script lang="ts">
    import { Nav, MobileNav } from '#lib/ui/nav';
    import type { LayoutProps } from '../$types';

    let { children }: LayoutProps = $props();
</script>

<Nav />
<MobileNav />
{@render children()}