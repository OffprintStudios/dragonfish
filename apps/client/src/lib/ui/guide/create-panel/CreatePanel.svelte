<script lang="ts">
    import { BookOpenLine, CupLine, QuillPenLine } from 'svelte-remixicon';
</script>

<div class="h-screen max-w-[24rem] flex flex-col overflow-y-auto">
    <div class="sticky flex items-center px-4 h-16 place-content-between" style="background: var(--accent);">
        <div class="w-1/4">
            <!--spacer-->
        </div>
        <div class="w-2/4 font-bold tracking-widest uppercase text-xs text-white text-center">
            create
        </div>
        <div class="w-1/4">
            <!--spacer-->
        </div>
    </div>
    <div class="h-full w-11/12 mx-auto my-6 flex flex-col items-center">
        <a class="create-button border-zinc-700 dark:border-white" href="/create/new-prose">
            <BookOpenLine size="24px" class="mr-2" />
            <span>New Prose</span>
        </a>
        <a class="create-button border-zinc-700 dark:border-white" href="/create/new-poetry">
            <QuillPenLine size="24px" class="mr-2" />
            <span>New Poetry</span>
        </a>
        <a class="create-button border-zinc-700 dark:border-white" href="/create/new-blog">
            <CupLine size="24px" class="mr-2" />
            <span>New Blog</span>
        </a>
    </div>
</div>

<style lang="scss">
    a.create-button {
        @apply w-full border rounded-lg flex items-center justify-center py-6 mb-4 transition transform no-underline;
        color: var(--text-color);
        &:hover {
            @apply text-white scale-105;
            background: var(--accent);
        }
        span {
            @apply text-sm uppercase font-bold tracking-widest;
        }
    }
</style>