<script lang="ts">
    import { BookOpenLine, QuillPenLine, CupLine } from 'svelte-remixicon';
</script>

<div class="w-full h-screen flex flex-col">
    <div class="topbar">
        <div class="flex-1 text-center uppercase text-sm font-bold tracking-widest text-white   ">
            Create
        </div>
    </div>
    <div class="my-6 w-11/12 mx-auto">
        <a href="/create/new-prose" class="create-button border-zinc-700 dark:border-white">
            <BookOpenLine size="24px" class="mr-2" />
            <span>New Prose</span>
        </a>
        <a href="/create/new-poetry" class="create-button border-zinc-700 dark:border-white">
            <QuillPenLine size="24px" class="mr-2" />
            <span>New Poetry</span>
        </a>
        <a href="/create/new-blog" class="create-button border-zinc-700 dark:border-white">
            <CupLine size="24px" class="mr-2" />
            <span>New Blog</span>
        </a>
    </div>
</div>

<style lang="scss">
    div.topbar {
        @apply w-full px-4 flex items-center drop-shadow-xl relative z-40 py-6;
        background: var(--accent);
    }

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
