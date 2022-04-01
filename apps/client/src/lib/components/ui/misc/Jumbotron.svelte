<script lang="ts">
    import { useQuery } from '@sveltestack/svelte-query';
    import { slide } from 'svelte/transition';
    import { fetchFeaturedPosts } from '$lib/services/content.service';
    import { CloseLine, InformationLine, Loader5Line } from 'svelte-remixicon';
    import { localeDate } from '$lib/util';

    enum Slides {
        First = 0,
        Second = 1,
        Third = 2,
        Fourth = 3,
    }
    let activeSlide: Slides = Slides.First;
    let currentIndex = 0;

    const featuredPosts = useQuery('featuredPosts', fetchFeaturedPosts);

    function switchActiveSlide(index: number) {
        switch (index) {
            case 0:
                currentIndex = 0;
                activeSlide = Slides.First;
                break;
            case 1:
                currentIndex = 1;
                activeSlide = Slides.Second;
                break;
            case 2:
                currentIndex = 2;
                activeSlide = Slides.Third;
                break;
            case 3:
                currentIndex = 3;
                activeSlide = Slides.Fourth;
                break;
        }
    }
</script>

{#if $featuredPosts.isLoading}
    <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="flex items-center">
            <Loader5Line class="animate-spin mr-2" size="24px" />
            <span class="font-bold uppercase tracking-widest">Loading...</span>
        </div>
    </div>
{:else if $featuredPosts.isError}
    <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="flex items-center">
            <CloseLine class="mr-2" size="24px" />
            <span class="font-bold uppercase tracking-widest"
                >Error retrieving featured posts
            </span>
        </div>
    </div>
{:else if $featuredPosts.data.length === 0}
    <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="flex items-center">
            <InformationLine class="mr-2" size="24px" />
            <span class="font-bold uppercase tracking-widest">Nothing currently featured</span>
        </div>
    </div>
{:else}
    <div class="jumbotron">
        <div class="big-box">
            {#key currentIndex}
                <div transition:slide|local={{ delay: 0, duration: 300 }}>
                    <img src={$featuredPosts.data[currentIndex].meta.banner} alt="banner" />
                    <div
                        class="box-info bg-zinc-300 dark:bg-zinc-700 bg-opacity-75 dark:bg-opacity-75 backdrop-blur"
                    >
                        <h1>
                            <a href="/blog/{$featuredPosts.data[currentIndex]._id}">
                                {$featuredPosts.data[currentIndex].title}
                            </a>
                        </h1>
                        {#if $featuredPosts.data[currentIndex].desc}
                            <h2>{$featuredPosts.data[currentIndex].desc}</h2>
                        {/if}
                    </div>
                </div>
            {/key}
        </div>
        <div class="card-stack">
            {#each $featuredPosts.data as post, index}
                <div
                    class="card"
                    class:active={currentIndex === index}
                    on:click={() => switchActiveSlide(index)}
                >
                    <div class="flex-1 truncate">
                        <h3>{post.title}</h3>
                        <div class="flex items-center">
                            <span class="hidden text-sm md:text-base md:block"
                                >by {post.author.screenName}</span
                            >
                            <span class="hidden md:block mx-1">•</span>
                            <span class="text-sm md:text-base"
                                >{localeDate(post.audit.publishedOn, 'fullDate')}</span
                            >
                        </div>
                    </div>
                    <img src={$featuredPosts.data[0].author.profile.avatar} alt="demo avatar" />
                </div>
            {/each}
        </div>
    </div>
{/if}

<style lang="scss">
    div.jumbotron {
        @apply w-full h-full flex flex-col md:flex-row relative;
        div.big-box {
            @apply w-full md:w-2/3 relative overflow-hidden;
            img {
                @apply object-cover h-full w-full;
            }
            div.box-info {
                @apply absolute bottom-6 left-0 p-4 pl-6 rounded-r-lg hidden md:block;
                h1 {
                    @apply text-3xl md:text-5xl font-medium;
                    a {
                        color: var(--text-color);
                    }
                    color: var(--text-color);
                }
                h2 {
                    @apply text-xl md:text-3xl;
                    color: var(--text-color);
                }
            }
        }
        div.card-stack {
            @apply w-full md:w-1/3 flex overflow-x-auto md:flex-col;
            div.card {
                @apply border-t-8 border-r md:border-r-0 md:border-t-0 md:border-l-8 md:border-b border-zinc-300 dark:border-zinc-600 min-w-[280px] max-w-[280px] md:max-w-full md:min-w-full md:w-full md:h-1/4 flex items-center p-4 cursor-pointer;
                &:last-child {
                    @apply border-b-0 border-r-0;
                }
                &.active {
                    @apply bg-zinc-200 dark:bg-zinc-700;
                    border-left-color: var(--accent);
                }
                h3 {
                    @apply text-lg md:text-2xl font-medium w-full truncate;
                }
                img {
                    @apply w-16 h-16 rounded-full border-2 hidden md:block;
                    border-color: var(--borders);
                }
            }
        }
    }
</style>
