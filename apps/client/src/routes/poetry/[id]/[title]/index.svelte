<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit';
    import { goto } from '$app/navigation';

    export const load: Load = async ({ params }) => {
        goto('/poetry/' + params.id);

        return {
            props: {
            },
        };
    };
</script>
