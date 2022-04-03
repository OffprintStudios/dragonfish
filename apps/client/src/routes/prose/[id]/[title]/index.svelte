<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit';

    export const load: Load = async ({ params }) => {
        return {
            status: 302,
            redirect: '/prose/' + params.id
        };
    };
</script>
