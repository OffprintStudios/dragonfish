<script context="module" lang="ts">
    import { isLoggedIn } from '$lib/repo/session.repo';
    import { setError } from '$lib/repo/app.repo';
    import type { Load } from '@sveltejs/kit';

    export const load: Load = async () => {
        if (isLoggedIn()) {
            return {
                status: 200,
            };
        } else {
            setError('401 Forbidden', 'You do not have permission to view this page.');
            return {
                status: 401,
            };
        }
    };
</script>

<slot />
