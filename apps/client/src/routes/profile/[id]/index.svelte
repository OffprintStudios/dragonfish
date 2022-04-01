<script lang="ts">
    import { app } from '$lib/repo/app.repo';
    import { profile } from '$lib/repo/profile.repo';
    import { localeDate } from '$lib/util';
    import { Gift2Line } from 'svelte-remixicon';
    import { getProfileContent } from '$lib/services/profile.service';
    import type { Content } from '$lib/models/content';
    import BlogCard from '$lib/components/ui/content/BlogCard.svelte';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';

    let works: Content[] = [];
    let blogs: Content[] = [];

    getProfileContent($profile._id, $app.filter).subscribe((res) => {
        works = res.works;
        blogs = res.blogs;
    });
</script>

<svelte:head>
    <title>{$profile.screenName}'s Profile &mdash; Offprint</title>
    <!-- Primary Meta Tags -->
    <meta name="title" content="{$profile.screenName}'s Profile on Offprint" />
    <meta name="description" content="Taking a look at {$profile.screenName}'s stuff" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://offprint.net/profile/{$profile._id}" />
    <meta property="og:title" content="{$profile.screenName}'s Profile on Offprint" />
    <meta property="og:description" content="Taking a look at {$profile.screenName}'s stuff" />
    <meta property="og:image" content={$profile.profile.avatar} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://offprint.net/profile/{$profile._id}" />
    <meta property="twitter:title" content="{$profile.screenName}'s Profile on Offprint" />
    <meta property="twitter:description" content="Taking a look at {$profile.screenName}'s stuff" />
    <meta property="twitter:image" content={$profile.profile.avatar} />
</svelte:head>

<div class="w-full mx-auto">
    <div class="max-w-[90rem] mx-auto">
        <div class="flex flex-col md:flex-row md:max-w-7xl mx-auto">
            <div class="p-4 w-52">
                <h5 class="text-2xl font-medium text-center mb-4">About Me</h5>
                {#if $profile.profile.bio}
                    <p class="text-sm text-center">{$profile.profile.bio}</p>
                    <div class="my-2.5 border-b" style="border-color: var(--borders)">
                        <!--spacer-->
                    </div>
                {/if}
                <div class="flex flex-col items-center">
                    <div class="flex flex-row items-center text-sm">
                        <Gift2Line class="mr-1" size="20px" />Joined {localeDate(
                            $profile.createdAt,
                            'mediumDate',
                        )}
                    </div>
                </div>
            </div>
            <div class="w-full lg:w-[42rem] flex-1 ml-4 mr-6">
                <div class="border-b mb-4 border-zinc-700 dark:border-white w-full mt-4">
                    <h3 class="text-2xl font-medium">Latest Blogs</h3>
                </div>
                {#if blogs.length === 0}
                    <div class="empty">
                        <h3>Nothing to see here...</h3>
                        <p>Check back when this user has posted something!</p>
                    </div>
                {:else}
                    {#each blogs as blog}
                        <div class="my-3">
                            <BlogCard {blog} />
                        </div>
                    {/each}
                {/if}
            </div>
            <div class="w-full lg:w-[22rem]">
                <div class="border-b mb-4 border-zinc-700 dark:border-white mt-4">
                    <h3 class="text-2xl font-medium">Latest Works</h3>
                </div>
                {#if works.length === 0}
                    <div class="empty">
                        <h3>Nothing to see here...</h3>
                        <p>Check back when this user has posted something!</p>
                    </div>
                {:else}
                    {#each works as work}
                        <div class="my-3">
                            <WorkCard content={work} />
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
</div>
