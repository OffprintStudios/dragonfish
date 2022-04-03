<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit';
    import { goto } from '$app/navigation';

    export const load: Load = async ({ params }) => {
        goto('/profile/' + params.id + '/shelf/' + params.shelfId);

        return {
            props: {
            },
        };
    };
</script>
