<script lang="ts">
    import { app } from '$lib/repo/app.repo';
</script>

<div class="empty">
    {#if $app.error}
        <h3>{$app.error.title}</h3>
        <p>
            {$app.error.desc}
        </p>
    {:else}
        <h3>Something went wrong!</h3>
        <p>Please contact site administration with details of how you got here.</p>
    {/if}
</div>
