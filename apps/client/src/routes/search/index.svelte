<script lang="ts">
    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import Select from 'svelte-select';
    import { Loader5Line, SearchEyeLine, SoundModuleFill, EraserLine } from 'svelte-remixicon';
    import { Content, SearchKind, SearchMatch } from '$lib/models/content';
    import RadioButton from '$lib/components/forms/RadioButton.svelte';
    import { Genres, TagKind, WorkKind } from '$lib/models/content/works';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { fetchTagsTrees } from '$lib/services/tags.service';
    import { findRelatedContent, findUser } from '$lib/services/search.service';
    import { app } from '$lib/repo/app.repo';
    import type { PaginateResult } from '$lib/models/util';
    import type { Profile } from '$lib/models/accounts';
    import {
        search,
        searchOptions,
        searchSelect,
        resetSearchOptions,
        setFilter,
        searchWorks,
        searchBlogs,
        searchUsers,
    } from '$lib/repo/search.repo';
    import Paginator from '$lib/components/ui/misc/Paginator.svelte';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';
    import BlogCard from '$lib/components/ui/content/BlogCard.svelte';
    import UserCard from '$lib/components/ui/user/UserCard.svelte';
    import { pluralize } from '$lib/util';

    let tagOptions: { value: string; label: string; isParent: boolean }[] = [];
    onMount(() => {
        fetchTagsTrees(TagKind.Fandom).subscribe((fandomTags) => {
            for (const parent of fandomTags) {
                tagOptions = [
                    ...tagOptions,
                    { value: parent._id, label: parent.name, isParent: parent.children.length > 0 },
                ];
                for (const child of parent.children) {
                    tagOptions = [
                        ...tagOptions,
                        {
                            value: child._id,
                            label: `${parent.name} — ${child.name}`,
                            isParent: false,
                        },
                    ];
                }
            }
        });
    });

    let filtersMenuOpen = false;
    const genres = Object.entries(Genres).map(([key, value]) => ({
        value: key,
        label: value
    })).sort((a, b) => (a.value < b.value ? -1 : 1));
    const categories = Object.entries(WorkKind).map(([key, value]) => ({
        value: key,
        label: value,
    })).sort((a, b) => (a.value < b.value ? -1 : 1));
    let contentResults: PaginateResult<Content> = null;
    let userResults: PaginateResult<Profile> = null;
    let loading = false;

    $: setFilter($app.filter);

    async function fetchPage(page: number) {
        $search.page = page;
        if ($search.kind === SearchKind.User) {
            userResults = await findUser($search.query, $search.page);
        } else {
            if ($search.kind === SearchKind.Blog) {
                contentResults = await findRelatedContent($search);
            } else {
                contentResults = await findRelatedContent($search);
            }
        }
    }

    async function submitQuery() {
        loading = true;

        contentResults = null;
        userResults = null;

        if ($searchOptions.kind !== SearchKind.User) {
            if ($searchOptions.kind === SearchKind.Blog) {
                // we're looking for blogs
                searchBlogs(1);
                contentResults = await findRelatedContent($search).then((res) => {
                    loading = false;
                    return res;
                });
            } else {
                // we're looking for prose and/or poetry
                searchWorks(1);
                contentResults = await findRelatedContent($search).then((res) => {
                    loading = false;
                    return res;
                });
            }
        } else {
            // we're looking for users
            searchUsers(1);
            userResults = await findUser($search.query, $search.page).then((res) => {
                loading = false;
                return res;
            });
        }
    }
</script>

<svelte:head>
    <title>Search &mdash; Offprint</title>
</svelte:head>

<div class="w-full h-[calc(100vh-51px)] md:h-screen overflow-y-auto">
    <div class="w-11/12 mx-auto max-w-4xl">
        <form
            class="my-10 w-full bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed rounded-lg"
            on:submit|preventDefault={submitQuery}
        >
            <div class="w-full border-b-2 border-zinc-500">
                <div class="search-bar">
                    <span class="md:block hidden"
                        ><SearchEyeLine size="28px" class="ml-4 mr-2" /></span
                    >
                    <input
                        class="search-input"
                        placeholder="Search..."
                        type="text"
                        bind:value={$searchOptions.query}
                    />
                    <span class="hidden md:block md:mx-2"><!--separator--></span>
                </div>
            </div>
            <div class="flex items-center justify-center md:justify-start flex-wrap p-2">
                <RadioButton
                    id={SearchKind.ProseAndPoetry}
                    bind:group={$searchOptions.kind}
                    value={SearchKind.ProseAndPoetry}
                >
                    All Works
                </RadioButton>
                <RadioButton
                    id={SearchKind.Prose}
                    bind:group={$searchOptions.kind}
                    value={SearchKind.Prose}
                >
                    Prose
                </RadioButton>
                <RadioButton
                    id={SearchKind.Poetry}
                    bind:group={$searchOptions.kind}
                    value={SearchKind.Poetry}
                >
                    Poetry
                </RadioButton>
                <RadioButton id={SearchKind.Blog} bind:group={$searchOptions.kind} value={SearchKind.Blog}>
                    Blogs
                </RadioButton>
                <RadioButton id={SearchKind.User} bind:group={$searchOptions.kind} value={SearchKind.User}>
                    Users
                </RadioButton>
                <div class="flex-1 basis-full md:basis-0"><!--spacer--></div>
                <Button
                    isActive={filtersMenuOpen}
                    on:click={() => (filtersMenuOpen = !filtersMenuOpen)}
                >
                    <SoundModuleFill class="button-icon" />
                    <span class="button-text">Filters</span>
                </Button>
                <div class="mx-0.5"><!--spacer--></div>
                <Button on:click={resetSearchOptions}>
                    <EraserLine class="button-icon" />
                    <span class="button-text">Clear</span>
                </Button>
                <button class="search-button" type="submit">
                    <SearchEyeLine class="mr-2" />
                    <span>Search</span>
                </button>
            </div>
            {#if filtersMenuOpen && $searchOptions.kind !== SearchKind.User && $search.kind !== SearchKind.Blog}
                <div class="flex-1 pt-4" transition:slide|local>
                    <div class="flex flex-col w-full px-4 pb-4">
                        <label
                            for="workAuthor"
                            class="uppercase font-bold text-xs tracking-wider mb-1 ml-1"
                            >Author</label
                        >
                        <input
                            type="text"
                            class="rounded-lg bg-zinc-400 dark:bg-zinc-500 ring-0 placeholder-zinc-300 dark:placeholder-zinc-400 border-0"
                            id="workAuthor"
                            bind:value={$searchOptions.author}
                            placeholder="Beatriz Ex Machina"
                            data-felte-keep-on-remove
                        />
                        <div class="mt-2 mb-4"><!--spacer--></div>
                        <span class="uppercase font-bold text-xs tracking-wider mb-1 ml-1"
                            >Category</span
                        >
                        <div class="search-select">
                            <Select
                                items={categories}
                                bind:value={$searchSelect.category}
                                placeholder="Select Category"
                            />
                        </div>
                        <div class="mt-2 mb-4"><!--spacer--></div>
                        <span class="uppercase font-bold text-xs tracking-wider mb-1 ml-1"
                            >Genres</span
                        >
                        <div class="search-select">
                            <Select
                                items={genres}
                                bind:value={$searchSelect.genres}
                                isMulti
                                placeholder="Select Genre(s)"
                            />
                        </div>
                        <div class="flex items-center flex-wrap pt-4">
                            <RadioButton
                                id={`${SearchMatch.All}-1`}
                                bind:group={$searchOptions.matchGenres}
                                value={SearchMatch.All}
                            >
                                All Genres
                            </RadioButton>
                            <RadioButton
                                id={`${SearchMatch.Exactly}-1`}
                                bind:group={$searchOptions.matchGenres}
                                value={SearchMatch.Exactly}
                            >
                                Exact Match
                            </RadioButton>
                            <RadioButton
                                id={`${SearchMatch.NoOthers}-1`}
                                bind:group={$searchOptions.matchGenres}
                                value={SearchMatch.NoOthers}
                            >
                                No Others
                            </RadioButton>
                            <RadioButton
                                id={`${SearchMatch.OneOrMore}-1`}
                                bind:group={$searchOptions.matchGenres}
                                value={SearchMatch.OneOrMore}
                            >
                                One Or More
                            </RadioButton>
                        </div>
                        <div class="mt-2 mb-4"><!--spacer--></div>
                        <span class="uppercase font-bold text-xs tracking-wider mb-1 ml-1"
                            >Fandoms</span
                        >
                        <div class="search-select">
                            <Select
                                items={tagOptions}
                                bind:value={$searchSelect.fandoms}
                                isMulti
                                placeholder="Select Fandom(s)"
                            />
                        </div>
                        <div class="flex items-center pt-4 flex-wrap">
                            <RadioButton
                                id={`${SearchMatch.All}-2`}
                                bind:group={$searchOptions.matchTags}
                                value={SearchMatch.All}
                            >
                                All Fandoms
                            </RadioButton>
                            <RadioButton
                                id={`${SearchMatch.Exactly}-2`}
                                bind:group={$searchOptions.matchTags}
                                value={SearchMatch.Exactly}
                            >
                                Exact Match
                            </RadioButton>
                            <RadioButton
                                id={`${SearchMatch.NoOthers}-2`}
                                bind:group={$searchOptions.matchTags}
                                value={SearchMatch.NoOthers}
                            >
                                No Others
                            </RadioButton>
                            <RadioButton
                                id={`${SearchMatch.OneOrMore}-2`}
                                bind:group={$searchOptions.matchTags}
                                value={SearchMatch.OneOrMore}
                            >
                                One Or More
                            </RadioButton>
                        </div>
                    </div>
                    <button class="search-button" type="submit">
                        <SearchEyeLine class="mr-2" />
                        <span>Search</span>
                    </button>
                </div>
            {/if}
            {#if filtersMenuOpen && $searchOptions.kind === SearchKind.Blog}
                <div class="flex-1 pt-4" transition:slide|local>
                    <div class="flex flex-col w-full px-4 pb-4">
                        <label
                            for="blogAuthor"
                            class="uppercase font-bold text-xs tracking-wider mb-1 ml-1"
                            >Author</label
                        >
                        <input
                            type="text"
                            class="rounded-lg bg-zinc-400 dark:bg-zinc-500 ring-0 placeholder-zinc-300 dark:placeholder-zinc-400 border-0"
                            id="blogAuthor"
                            bind:value={$searchOptions.author}
                            placeholder="Beatriz Ex Machina"
                            data-felte-keep-on-remove
                        />
                    </div>
                    <button class="search-button" type="submit">
                        <SearchEyeLine class="mr-2" />
                        <span>Search</span>
                    </button>
                </div>
            {/if}
            {#if filtersMenuOpen && $searchOptions.kind === SearchKind.User}
                <div class="flex-1 pt-4" transition:slide|local>
                    <div class="flex flex-col w-full px-4 pb-4">
                        <span class="uppercase font-bold text-xs text-center tracking-wider"
                            >No Available Filters</span
                        >
                    </div>
                </div>
            {/if}
        </form>
    </div>
    {#if loading}
        <div class="w-full flex flex-col items-center justify-center h-48 md:h-96">
            <div class="flex items-center">
                <Loader5Line class="animate-spin mr-2" size="24px" />
                <span class="uppercase tracking-widest font-bold">Loading...</span>
            </div>
        </div>
    {:else if contentResults === null && userResults === null}
        <div class="w-full flex flex-col items-center justify-center h-48 md:h-96">
            <div class="flex items-center">
                <span class="uppercase tracking-widest font-bold text-center md:text-left">
                    You haven't searched for anything yet
                </span>
            </div>
        </div>
    {:else if $search.kind === SearchKind.User}
        {#if userResults && userResults.totalDocs > 0}
            <div class="w-full flex flex-col items-center justify-center mb-10">
                Found {userResults.totalDocs} user{pluralize(userResults.totalDocs)}
            </div>
            <div class="w-11/12 mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4">
                {#each userResults.docs as user}
                    <UserCard {user} />
                {/each}
            </div>
            <Paginator
                currPage={$search.page}
                totalPages={userResults.totalPages}
                on:change={(e) => fetchPage(e.detail)}
            />
        {:else}
            <div class="w-full flex flex-col items-center justify-center h-96">
                <div class="flex items-center">
                    <span class="uppercase tracking-widest font-bold">No user results found</span>
                </div>
            </div>
        {/if}
    {:else if $search.kind === SearchKind.Blog}
        {#if contentResults && contentResults.totalDocs > 0}
            <div class="w-full flex flex-col items-center justify-center mb-10">
                Found {contentResults.totalDocs} blog{pluralize(contentResults.totalDocs)}
            </div>
            <div class="w-11/12 mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each contentResults.docs.filter((blog) => blog.author !== null) as blog}
                    <BlogCard {blog} />
                {/each}
            </div>
            <Paginator
                currPage={$search.page}
                totalPages={contentResults.totalPages}
                on:change={(e) => fetchPage(e.detail)}
            />
        {:else}
            <div class="w-full flex flex-col items-center justify-center h-96">
                <div class="flex items-center">
                    <span class="uppercase tracking-widest font-bold">No blog results found</span>
                </div>
            </div>
        {/if}
    {:else if contentResults && contentResults.totalDocs > 0}
        <div class="w-full flex flex-col items-center justify-center mb-10">
            Found {contentResults.totalDocs} work{pluralize(contentResults.totalDocs)}
        </div>
        <div
            class="w-11/12 mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4"
        >
            {#each contentResults.docs.filter((work) => work.author !== null) as work}
                <WorkCard content={work} />
            {/each}
        </div>
        <Paginator
            currPage={$search.page}
            totalPages={contentResults.totalPages}
            on:change={(e) => fetchPage(e.detail)}
        />
    {:else}
        <div class="w-full flex flex-col items-center justify-center h-96">
            <div class="flex items-center">
                <span class="uppercase tracking-widest font-bold">No works found</span>
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    div.search-bar {
        @apply w-full flex items-center;
        input.search-input {
            @apply flex-1 max-w-full bg-transparent text-2xl h-[62px] border-none ring-0;
            &::placeholder {
                font-family: var(--header-text);
                @apply italic font-light relative top-0.5;
            }
        }
    }
    div.search-select {
        @apply flex-1;
        --tw-bg-opacity: 1;
        --tw-placeholder-opacity: 1;
        --borderRadius: 0.5rem;
        --background: rgb(113 113 122 / var(--tw-bg-opacity));
        --inputColor: var(--text-color);
        --listBackground: rgb(113 113 122 / var(--tw-bg-opacity));
        --itemHoverBG: var(--accent);
        --itemHoverColor: white;
        --placeholderColor: rgb(161 161 170 / var(--tw-placeholder-opacity));
        --border: none;
        --multiItemBG: var(--accent);
        --multiItemColor: white;
        --multiItemActiveBG: var(--accent-light);
    }
    button.search-button {
        @apply w-full flex items-center justify-center hover:bg-zinc-500 rounded-b-lg py-4 transition transform;
        span {
            @apply uppercase text-xs font-bold tracking-wider relative top-[0.075rem];
        }
    }
</style>
