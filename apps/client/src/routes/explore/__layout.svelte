<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import { createForm } from 'felte';
    import { page } from '$app/stores';
    import PageNav from '$lib/components/nav/PageNav.svelte';
    import { session } from '$lib/repo/session.repo';
    import {
        Compass3Line,
        SunLine,
        NewspaperLine,
        CalendarLine,
        CalendarEventLine,
        BookOpenLine,
        HeartLine,
        ArrowRightCircleLine,
        BookmarkLine,
        HistoryLine,
        BarChart2Fill,
        AddBoxLine,
        Gift2Line,
        Hashtag,
        CloseLine,
        CheckLine,
        Loader5Line,
        InformationLine,
        ArrowDownSLine,
        ArrowUpSLine,
    } from 'svelte-remixicon';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { useQuery, useMutation } from '@sveltestack/svelte-query';
    import { fetchShelves, createShelf } from '$lib/services/content-library.service';
    import type { Bookshelf, BookshelfForm } from '$lib/models/content/library';
    import { queryClient } from '$lib/util';
    import { fetchFollowing } from '$lib/services/profile.service';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';

    let showFollows = true;
    let showShelves = true;
    let showLibrary = true;

    const shelfList = useQuery('shelfList', () => fetchShelves($session.currProfile?._id), {
        enabled: !!$session.currProfile && !!$session.account,
    });

    const followsList = useQuery('followsList', () => fetchFollowing($session.currProfile?._id), {
        enabled: !!$session.currProfile && !!$session.account,
    });

    const makeShelf = useMutation(
        (newShelf: BookshelfForm) => createShelf($session.currProfile?._id, newShelf),
        {
            onMutate: async (newShelf) => {
                await queryClient.cancelQueries('shelfList');
                const previousShelves = queryClient.getQueryData<Bookshelf[]>('shelfList');
                queryClient.setQueryData('shelfList', (oldData) => [...oldData, newShelf]);
                return { previousShelves };
            },
            onError: (err, newShelf, context) => {
                queryClient.setQueryData('shelfList', context.previousShelves);
            },
            onSettled: () => {
                queryClient.invalidateQueries('shelfList');
            },
        },
    );

    let showNewShelfForm = false;
    const { form } = createForm({
        onSubmit: (values) => {
            const shelfForm: BookshelfForm = {
                name: values.name,
            };

            $makeShelf.mutate(shelfForm);
            showNewShelfForm = false;
        },
        initialValues: {
            name: '',
        },
        validate: (values) => {
            const errors = {
                name: '',
            };
            if (values.name.length < 3 || values.name.length > 32) {
                errors.name = `Bookshelf names must be between 3 and 32 characters in length`;
            }
            return errors;
        },
    });
</script>

<div class="flex flex-col md:flex-row w-full h-screen">
    <PageNav>
        <svelte:fragment slot="header">
            <h3>Explore</h3>
            <Compass3Line />
        </svelte:fragment>
        <svelte:fragment slot="pages">
            <a href="/explore" class:active={$page.url.pathname === '/explore'}>
                <!--<span class="link-icon"><MistFill /></span>-->
                <span class="link-icon"><NewspaperLine /></span>
                <span class="text">New Works</span>
            </a>
            {#if $session.currProfile}
                <a
                    href="/explore/recommendations"
                    class:active={$page.url.pathname === '/explore/recommendations'}
                >
                    <span class="link-icon"><Gift2Line /></span>
                    <span class="text">Recommendations</span>
                </a>
            {/if}
            <a
                href="/explore/popular-this-week"
                class:active={$page.url.pathname === '/explore/popular-this-week'}
            >
                <span class="link-icon"><CalendarLine /></span>
                <span class="text">Popular This Week</span>
            </a>
            <a
                href="/explore/popular-today"
                class:active={$page.url.pathname === '/explore/popular-today'}
            >
                <span class="link-icon"><CalendarEventLine /></span>
                <span class="text">Popular Today</span>
            </a>
            <!--<a href="/explore/new-works" class:active={$page.url.pathname === '/explore/new-works'}>
                <span class="link-icon"><NewspaperLine /></span>
                <span class="text">New Works</span>
            </a>-->
            <a href="/explore/tags" class:active={$page.url.pathname === '/explore/tags'}>
                <span class="link-icon"><Hashtag /></span>
                <span class="text">Fandom Tags</span>
            </a>
            <a
                href="/explore/special-events"
                class:active={$page.url.pathname === '/explore/special-events'}
            >
                <span class="link-icon"><SunLine /></span>
                <span class="text">Special Events</span>
            </a>
            {#if $session.currProfile}
                <div class="mt-2 hidden md:block">
                    <div class="flex items-center">
                        <h5
                            class="text-lg font-medium mb-1 flex-1 relative top-1"
                            style="color: var(--text-color)"
                        >
                            Following
                        </h5>
                        <Button on:click={() => (showFollows = !showFollows)}>
                            {#if showFollows}
                                <ArrowDownSLine class="button-icon no-text" />
                            {:else}
                                <ArrowUpSLine class="button-icon no-text" />
                            {/if}
                        </Button>
                    </div>
                    {#if $followsList.isLoading}
                        <div class="w-full h-12 flex flex-col items-center justify-center">
                            <div class="flex items-center">
                                <Loader5Line class="animate-spin mr-2" />
                                <span
                                    class="text-xs uppercase font-bold tracking-wider relative top-[0.075rem]"
                                    >Loading...</span
                                >
                            </div>
                        </div>
                    {:else if $followsList.isError}
                        <div class="w-full h-12 flex flex-col items-center justify-center">
                            <div class="flex items-center">
                                <CloseLine class="mr-2" />
                                <span
                                    class="text-xs uppercase font-bold tracking-wider relative top-[0.075rem]"
                                    >Error!</span
                                >
                            </div>
                        </div>
                    {:else if $followsList.data.length === 0}
                        <div class="w-full h-12 flex flex-col items-center justify-center">
                            <div class="flex items-center">
                                <InformationLine class="mr-2" />
                                <span
                                    class="text-xs uppercase font-bold tracking-wider relative top-[0.075rem]"
                                    >Nothing followed yet</span
                                >
                            </div>
                        </div>
                    {:else if showFollows}
                        <div transition:slide|local>
                            {#each $followsList.data as follow}
                                <a
                                    class="hide"
                                    href="/explore/following/{follow.itemId._id}"
                                    class:active={$page.url.pathname ===
                                        `/explore/following/${follow.itemId._id}`}
                                >
                                    <span class="link-icon">
                                        <Avatar
                                            src={follow.itemId.profile.avatar}
                                            size="32px"
                                            borderWidth="1px"
                                        />
                                    </span>
                                    <span class="text">{follow.itemId.screenName}</span>
                                </a>
                            {/each}
                        </div>
                    {/if}
                </div>
                <div class="mt-2 hidden md:block">
                    <div class="flex items-center">
                        <h5
                            class="text-lg font-medium mb-1 flex-1 relative top-1"
                            style="color: var(--text-color)"
                        >
                            Library
                        </h5>
                        <Button on:click={() => (showLibrary = !showLibrary)}>
                            {#if showLibrary}
                                <ArrowDownSLine class="button-icon no-text" />
                            {:else}
                                <ArrowUpSLine class="button-icon no-text" />
                            {/if}
                        </Button>
                    </div>
                    {#if showLibrary}
                        <div transition:slide|local>
                            <a
                                class="hide"
                                href="/explore/library"
                                class:active={$page.url.pathname === '/explore/library'}
                            >
                                <span class="link-icon"><BookOpenLine /></span>
                                <span class="text">Prose & Poetry</span>
                            </a>
                            <a
                                class="hide"
                                href="/explore/library/favorite-blogs"
                                class:active={$page.url.pathname ===
                                    '/explore/library/favorite-blogs'}
                            >
                                <span class="link-icon"><HeartLine /></span>
                                <span class="text">Blogs</span>
                            </a>
                            <a
                                class="hide"
                                href="/explore/library/read-it-later"
                                class:active={$page.url.pathname ===
                                    '/explore/library/read-it-later'}
                            >
                                <span class="link-icon"><ArrowRightCircleLine /></span>
                                <span class="text">Read It Later</span>
                            </a>
                            <a
                                class="hide"
                                href="/explore/library/finished-reading"
                                class:active={$page.url.pathname ===
                                    '/explore/library/finished-reading'}
                            >
                                <span class="link-icon"><BookmarkLine /></span>
                                <span class="text">Finished Reading</span>
                            </a>
                            <a
                                class="hide"
                                href="/explore/library/reading-history"
                                class:active={$page.url.pathname ===
                                    '/explore/library/reading-history'}
                            >
                                <span class="link-icon"><HistoryLine /></span>
                                <span class="text">Reading History</span>
                            </a>
                        </div>
                    {/if}
                </div>
                <div class="mt-2 hidden md:block">
                    <div class="flex items-center">
                        <h5
                            class="text-lg font-medium mb-1 flex-1 relative top-1"
                            style="color: var(--text-color)"
                        >
                            Bookshelves
                        </h5>
                        <Button on:click={() => (showShelves = !showShelves)}>
                            {#if showShelves}
                                <ArrowDownSLine class="button-icon no-text" />
                            {:else}
                                <ArrowUpSLine class="button-icon no-text" />
                            {/if}
                        </Button>
                    </div>
                    {#if $shelfList.isLoading}
                        <div class="w-full h-12 flex flex-col items-center justify-center">
                            <div class="flex items-center">
                                <Loader5Line class="animate-spin mr-2" />
                                <span
                                    class="text-xs uppercase font-bold tracking-wider relative top-[0.075rem]"
                                    >Loading...</span
                                >
                            </div>
                        </div>
                    {:else if $shelfList.isError}
                        <div class="w-full h-12 flex flex-col items-center justify-center">
                            <div class="flex items-center">
                                <CloseLine class="mr-2" />
                                <span
                                    class="text-xs uppercase font-bold tracking-wider relative top-[0.075rem]"
                                    >Error!</span
                                >
                            </div>
                        </div>
                    {:else if $shelfList.data.length === 0}
                        <div class="w-full h-12 flex flex-col items-center justify-center">
                            <div class="flex items-center">
                                <InformationLine class="mr-2" />
                                <span
                                    class="text-xs uppercase font-bold tracking-wider relative top-[0.075rem]"
                                    >No shelves yet</span
                                >
                            </div>
                        </div>
                        {#if showNewShelfForm}
                            <form in:fade={{ delay: 0, duration: 150 }} use:form>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="My new favorite things"
                                    class="rounded-lg bg-zinc-400 dark:bg-zinc-600 ring-0 w-full"
                                />
                                <div class="flex items-center justify-center mt-2">
                                    <Button
                                        type="button"
                                        on:click={() => (showNewShelfForm = !showNewShelfForm)}
                                    >
                                        <CloseLine class="button-icon" />
                                        <span class="button-text">Cancel</span>
                                    </Button>
                                    <div class="mx-1"><!--separator--></div>
                                    <Button
                                        type="submit"
                                        kind="primary"
                                        loading={$makeShelf.isLoading}
                                        loadingText="Saving..."
                                    >
                                        <CheckLine class="button-icon" />
                                        <span class="button-text">Submit</span>
                                    </Button>
                                </div>
                            </form>
                        {:else}
                            <button
                                class="wide-button hide"
                                in:fade={{ delay: 0, duration: 150 }}
                                on:click={() => (showNewShelfForm = !showNewShelfForm)}
                            >
                                <span class="link-icon"><AddBoxLine /></span>
                                <span class="text">Add Bookshelf</span>
                            </button>
                        {/if}
                    {:else if showShelves}
                        <div transition:slide|local>
                            {#each $shelfList.data as shelf}
                                <a class="hide" href="/explore/library/shelf/{shelf._id}">
                                    <span class="link-icon"><BarChart2Fill /></span>
                                    <span class="text">{shelf.name}</span>
                                </a>
                            {/each}
                            {#if showNewShelfForm}
                                <form in:fade={{ delay: 0, duration: 150 }} use:form>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="My new favorite things"
                                        class="rounded-lg bg-zinc-400 dark:bg-zinc-600 ring-0 w-full"
                                    />
                                    <div class="flex items-center justify-center mt-2">
                                        <Button
                                            type="button"
                                            on:click={() => (showNewShelfForm = !showNewShelfForm)}
                                        >
                                            <CloseLine class="button-icon" />
                                            <span class="button-text">Cancel</span>
                                        </Button>
                                        <div class="mx-1"><!--separator--></div>
                                        <Button
                                            type="submit"
                                            kind="primary"
                                            loading={$makeShelf.isLoading}
                                            loadingText="Saving..."
                                        >
                                            <CheckLine class="button-icon" />
                                            <span class="button-text">Submit</span>
                                        </Button>
                                    </div>
                                </form>
                            {:else}
                                <button
                                    class="wide-button hide"
                                    in:fade={{ delay: 0, duration: 150 }}
                                    on:click={() => (showNewShelfForm = !showNewShelfForm)}
                                >
                                    <span class="link-icon"><AddBoxLine /></span>
                                    <span class="text">Add Bookshelf</span>
                                </button>
                            {/if}
                        </div>
                    {/if}
                </div>
            {/if}
        </svelte:fragment>
    </PageNav>
    <slot />
</div>
