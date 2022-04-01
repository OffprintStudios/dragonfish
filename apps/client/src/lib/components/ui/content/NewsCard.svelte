<script lang="ts">
    import { localeDate } from '$lib/util';
    import type { Blog } from '$lib/models/content/blogs';

    export let post: Blog;
</script>

<a
    class="w-full border border-zinc-600 dark:border-white rounded-md p-2 flex items-center mb-2 transition transform hover:scale-105 hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer no-underline active:scale-100"
    href="/blog/{post._id}"
    style="color: var(--text-color);"
>
    <img
        src={post.author.profile.avatar}
        alt="demo avatar"
        class="rounded-full border-2"
        style="max-width: 2.5rem; border-color: var(--borders);"
    />
    <div class="truncate flex-1 w-full ml-2">
        <h4 class="text-lg font-medium top-1">
            {post.title}
        </h4>
        <div class="relative -top-1 flex items-center">
            <span class="text-xs">by {post.author.screenName}</span>
            <span class="text-xs mx-0.5">•</span>
            <span class="text-xs">{localeDate(post.audit.publishedOn, 'shortDate')}</span>
        </div>
    </div>
</a>
