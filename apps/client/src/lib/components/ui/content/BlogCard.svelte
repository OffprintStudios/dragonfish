<script lang="ts">
    import type { Blog } from '$lib/models/content/blogs';
    import { abbreviate, localeDate } from '$lib/util';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';
    import { DiscussLine, BarChartBoxLine } from 'svelte-remixicon';
    import type { Content } from '$lib/models/content';

    export let blog: Blog | Content;
</script>

<a
    class="blog-card border-zinc-700 dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
    href="/blog/{blog._id}"
>
    <div class="flex items-center p-4">
        <Avatar size="4rem" src={blog.author.profile.avatar} />
        <div class="ml-4 w-full">
            <h3 class="font-medium text-3xl">{blog.title}</h3>
            <div class="author flex-1" title="by {blog.author.screenName}">
                <a href="/profile/{blog.author._id}">
                    by {blog.author.screenName}
                </a>
            </div>
        </div>
    </div>
    <div class="flex items-center w-full text-sm px-4">
        <span class="flex-1 uppercase font-bold tracking-wider">
            {localeDate(blog.createdAt, 'fullDate')}
        </span>
        <span class="flex items-center"
            ><BarChartBoxLine class="mr-1" /> {abbreviate(blog.stats.views)}</span
        >
        <span class="mx-0.5">|</span>
        <span class="flex items-center"
            ><DiscussLine class="mr-1" /> {abbreviate(blog.stats.comments)}</span
        >
    </div>
    <div class="blog-body px-4">
        {@html blog.body}
    </div>
    <div class="continue-reading" />
</a>

<style lang="scss">
    a.blog-card {
        @apply block w-full border rounded-lg h-72 relative no-underline transition transform overflow-hidden;
        color: var(--text-color);
        &:hover {
            @apply scale-105;
        }
        &:active {
            @apply scale-100;
        }
        div.author {
            a {
                color: var(--text-color);
            }
        }
        div.continue-reading {
            @apply absolute z-10 bottom-0 w-full rounded-b-lg flex items-center justify-center h-12;
            background: linear-gradient(
                to top,
                var(--background),
                var(--background) calc(100% - 50px),
                rgba(0, 0, 0, 0) calc(100% - 5px),
                rgba(0, 0, 0, 0)
            );
        }
    }
</style>
