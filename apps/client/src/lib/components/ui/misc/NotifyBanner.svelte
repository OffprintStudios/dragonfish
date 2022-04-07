<script lang="ts">
    import { InformationLine } from 'svelte-remixicon';

    export let message = 'This banner should say something important.';
</script>

<div
    class="flex flex-col md:flex-row items-center w-11/12 mx-auto max-w-3xl border rounded-lg border-zinc-700 dark:border-white p-4"
>
    <InformationLine size="24px" class="mr-2" />
    <div class="flex-1">
        {@html message}
    </div>
</div>
