<script lang="ts">
    import { slogans } from '$lib/models/site';
    import Jumbotron from '$lib/components/ui/misc/Jumbotron.svelte';
    import { CloseLine, HeartsLine, InformationLine, Loader5Line } from 'svelte-remixicon';
    import { useQuery } from '@sveltestack/svelte-query';
    import { fetchFirstNew, fetchFirstNewsPosts } from '$lib/services/content.service';
    import { app } from '$lib/repo/app.repo';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';
    import NewsCard from '$lib/components/ui/content/NewsCard.svelte';

    const currSlogan = slogans[Math.floor(Math.random() * slogans.length)];
    const newWorks = useQuery('newWorks', () => fetchFirstNew($app.filter));
    const firstSixNews = useQuery('firstSixNews', fetchFirstNewsPosts);
</script>

<svelte:head>
    <title>Home &mdash; Offprint</title>
    <!-- Primary Meta Tags -->
    <meta name="title" content="Offprint" />
    <meta name="description" content="A next-generation publishing and community platform." />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://offprint.net/" />
    <meta property="og:title" content="Offprint" />
    <meta
        property="og:description"
        content="A next-generation publishing and community platform."
    />
    <meta property="og:image" content="/images/offprint_icon.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://offprint.net/" />
    <meta property="twitter:title" content="Offprint" />
    <meta
        property="twitter:description"
        content="A next-generation publishing and community platform."
    />
    <meta property="twitter:image" content="/images/offprint_icon.png" />
</svelte:head>

<div class="w-full h-[calc(100vh-51px)] md:h-screen overflow-y-auto">
    <div class="w-full mb-6">
        <div class="home-header hidden md:block">
            <img
                src="/images/logo.png"
                alt="logo"
                style="max-width: 24rem; margin: 0 auto;"
                class="relative z-30"
            />
            <h2 class="text-white text-2xl relative z-30">{currSlogan}</h2>
        </div>
        <div class="jumbo-carousel">
            <Jumbotron />
        </div>
    </div>
    <div class="w-11/12 mx-auto max-w-7xl my-6 flex flex-col md:flex-row">
        <div class="flex-1">
            <!--{#if $session.currProfile && $session.token}
            <div class="section">
                <div class="section-header border-zinc-600 dark:border-white">
                    <h3>Recommendations</h3>
                    <a href="/explore/recommendations">See more >></a>
                </div>
                <div class="section-loading">
                    <div class="inner-loader">
                        <span>Select a profile to view recommendations</span>
                    </div>
                </div>
            </div>
        {/if}
        <div class="section">
            <div class="section-header border-zinc-600 dark:border-white">
                <h3>Popular this week</h3>
                <a href="/explore/popular-this-week">See more >></a>
            </div>
            <div class="section-loading">
                <div class="inner-loader">
                    <Loader5Line class="animate-spin mr-2" size="32px" />
                    <span>Loading...</span>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="section-header border-zinc-600 dark:border-white">
                <h3>Popular today</h3>
                <a href="/explore/popular-today">See more >></a>
            </div>
            <div class="section-loading">
                <div class="inner-loader">
                    <Loader5Line class="animate-spin mr-2" size="32px" />
                    <span>Loading...</span>
                </div>
            </div>
        </div>-->
            <div class="section">
                <div class="section-header border-zinc-600 dark:border-white">
                    <h3>New works</h3>
                    <a href="/explore">See more >></a>
                </div>
                {#if !$newWorks || $newWorks.isLoading}
                    <div class="section-loading">
                        <div class="inner-loader">
                            <Loader5Line class="animate-spin mr-2" size="32px" />
                            <span>Loading...</span>
                        </div>
                    </div>
                {:else if $newWorks.isError}
                    <div class="section-loading">
                        <div class="inner-loader">
                            <span>ERROR: Could not fetch content</span>
                        </div>
                    </div>
                {:else}
                    <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
                        {#each $newWorks.data as work}
                            <WorkCard content={work} />
                        {/each}
                    </div>
                {/if}
            </div>
            <!--<div class="section">
            <div class="section-header border-zinc-600 dark:border-white">
                <h3>Special events</h3>
                <a href="/explore/special-events">See more >></a>
            </div>
            <div class="section-loading">
                <div class="inner-loader">
                    <span>No Events Currently Running</span>
                </div>
            </div>
        </div>-->
        </div>
        <div class="w-11/12 mx-auto md:w-72 ml-4">
            <h3 class="text-2xl font-medium w-full border-b border-zinc-600 dark:border-white mb-4">
                News & Updates
            </h3>
            {#if !$firstSixNews || $firstSixNews.isLoading}
                <div class="w-full h-48 flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <Loader5Line class="animate-spin mr-2" />
                        <span class="text-xs uppercase font-bold tracking-wider">Loading...</span>
                    </div>
                </div>
            {:else if $firstSixNews.isError}
                <div class="w-full h-48 flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <CloseLine class="mr-2" />
                        <span class="text-xs uppercase font-bold tracking-wider"
                            >Error fetching news</span
                        >
                    </div>
                </div>
            {:else if $firstSixNews.data.length === 0}
                <div class="w-full h-48 flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <InformationLine class="mr-2" />
                        <span class="text-xs uppercase font-bold tracking-wider"
                            >No news posted</span
                        >
                    </div>
                </div>
            {:else}
                {#each $firstSixNews.data as post}
                    <NewsCard {post} />
                {/each}
            {/if}
        </div>
    </div>
    <div class="flex items-center justify-center flex-col md:flex-row">
        <a
            href="https://offprint.notion.site/Terms-of-Service-131ffadce0eb4e8a947144ddc70ef89b"
            target="_blank"
        >
            Terms of Service
        </a>
        <span class="mx-1">•</span>
        <a
            href="https://offprint.notion.site/Privacy-Policy-f22e8ccb9e9043dca23a29a7089c72f4"
            target="_blank"
        >
            Privacy Policy
        </a>
        <span class="mx-1">•</span>
        <a
            href="https://offprint.notion.site/The-Offprint-Constitution-ae58c23db7264280a319d1cdfa10bc41"
            target="_blank"
        >
            Offprint Constitution
        </a>
        <span class="mx-1">•</span>
        <a
            href="https://offprint.notion.site/Offprint-Omnibus-23ef302b8f7f4dd0bda13ba6e2471007"
            target="_blank"
        >
            Offprint Omnibus
        </a>
        <span class="mx-1">•</span>
        <a
            href="https://offprint.notion.site/What-is-Offprint-ac292f99beb1463c9cdaeb7f53557c74"
            target="_blank"
        >
            About Offprint
        </a>
    </div>
    <div class="mt-6 md:mt-0 mb-6 flex flex-col items-center justify-center">
        <span class="flex items-center">
            Made with <HeartsLine class="dark:text-white mx-1" /> by Offprint Studios
        </span>
        <span>&copy; 2022 Alyx Mote</span>
    </div>
</div>

<style lang="scss">
    div.home-header {
        @apply text-white text-center py-2 w-full flex flex-col items-center justify-center;
        background: var(--accent);
    }

    div.jumbo-carousel {
        @apply shadow-2xl mb-8 md:h-[32rem];
    }

    :global(.swipe-indicator .is-active) {
        background-color: white !important;
    }

    div.section {
        @apply mb-6;
        div.section-header {
            @apply flex items-center p-2 mb-4 border-b;
            h3 {
                @apply text-3xl font-medium flex-1;
            }

            a {
                @apply text-sm;
            }
        }

        div.section-loading {
            @apply w-full h-96 flex flex-col items-center justify-center;
            div.inner-loader {
                @apply flex items-center;
                span {
                    @apply uppercase font-bold tracking-widest;
                }
            }
        }
    }
</style>
