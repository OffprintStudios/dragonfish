<script lang="ts">
    import { InformationLine } from 'svelte-remixicon';

    export let message = 'This banner should say something important.';
</script>

<div
    class="flex flex-col md:flex-row items-center w-11/12 mx-auto max-w-3xl border rounded-lg border-zinc-700 dark:border-white overflow-hidden pr-1"
>
    <div
        class="w-full md:h-20 flex flex-col items-center justify-center bg-blue-600 md:w-12 px-1 py-1.5 md:py-0 mb-1 md:mb-0 md:mr-2"
    >
        <InformationLine size="24px" class="text-white" />
    </div>
    <div class="flex-1 p-2 md:p-0">
        {@html message}
    </div>
</div>
