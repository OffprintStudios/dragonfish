<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';
    import { setContent } from '$lib/repo/content.repo';

    export const load: Load = async ({ params }) => {
        const poetryId: string = params.id;

        setContent(null);
        return {
            props: {
                poetryId,
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

    export let poetryId: string;
    let currPage = $page.url.searchParams.has('page') ? +$page.url.searchParams.get('page') : 1;

    onMount(async () => {
        const poetry = await fetchOne(
            poetryId,
            $session.currProfile ? $session.currProfile._id : undefined,
        );

        setContent(poetry);
        // Sets comments in store
        await getPage(poetry._id, CommentKind.ContentComment, currPage)
    })
</script>

<slot />
