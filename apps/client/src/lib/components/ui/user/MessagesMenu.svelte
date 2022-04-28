<script lang="ts">
    import { session } from '$lib/repo/session.repo';
    import { useQuery } from '@sveltestack/svelte-query';
    import { fetchThreads } from '$lib/services/messages.service';

    const messageThreads = useQuery('messageThreads', () => fetchThreads(
        $session.account && $session.currProfile ? $session.currProfile._id : null
    ));
</script>

hi!