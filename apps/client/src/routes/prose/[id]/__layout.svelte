<script context="module" lang="ts">
    /// This layout file is required so that works are fetched before anything else gets touched.

    // import { get } from 'svelte/store';
    // import type { Load } from '@sveltejs/kit';
    // import { CommentKind } from '$lib/models/comments';
    // import { fetchOne } from '$lib/services/content.service';
    // import { setContent } from '$lib/repo/content.repo';
    // import { getPage } from '$lib/repo/comments.repo';
    // import { session } from '$lib/repo/session.repo';

    // export const load: Load = async ({ params, url }) => {
    //     const proseId: string = params.id;
    //     const page: number = url.searchParams.has('page') ? +url.searchParams.get('page') : 1;
    //     const prose = await fetchOne(
    //         proseId,
    //         get(session).currProfile ? get(session).currProfile._id : undefined,
    //     );

    //     setContent(prose);

    //     return {
    //         props: {
    //             content: prose,
    //             comments: await getPage(prose._id, CommentKind.ContentComment, page),
    //         },
    //     };
    // };
</script>

<slot />
