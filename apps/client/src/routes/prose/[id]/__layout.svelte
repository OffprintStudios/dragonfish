<script context="module" lang="ts">
    /// This layout file is required so that works are fetched before anything else gets touched.

    import type { Load } from '@sveltejs/kit';
    import { setContent } from '$lib/repo/content.repo';

    export const load: Load = async ({ params }) => {
        const proseId: string = params.id;

        setContent(null);
        return {
            props: {
                proseId,
            },
        };
    };
</script>
<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { CommentKind } from '$lib/models/comments';
    import { fetchOne } from '$lib/services/content.service';
    import { getPage } from '$lib/repo/comments.repo';
    import { session } from '$lib/repo/session.repo';

    export let proseId: string;
    let currPage = $page.url.searchParams.has('page') ? +$page.url.searchParams.get('page') : 1;

    onMount(async () => {
        const prose = await fetchOne(
            proseId,
            $session.currProfile ? $session.currProfile._id : undefined,
        );

        setContent(prose);
        // Sets comments in store
        await getPage(prose._id, CommentKind.ContentComment, currPage)
    })
</script>

<slot />
