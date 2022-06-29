<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';

    // export const load: Load = async ({ params }) => {
    //     const poetryId: string = params.id;
    //     console.log("Calling load for __layout for " + poetryId);

    //     return {
    //         props: {
    //             poetryId,
    //         },
    //     };
    // };
</script>

<slot />
