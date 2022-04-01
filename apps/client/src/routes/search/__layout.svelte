<script lang="ts">
    import { createForm } from 'felte';
    import { page } from '$app/stores';
    import { Content, SearchKind, SearchMatch } from '$lib/models/content';
    import { Genres, TagKind, WorkKind } from '$lib/models/content/works';
    import { search, tags } from '$lib/services';
    import { app } from '$lib/repo/app.repo';
    import type { PaginateResult } from '$lib/models/util';
    import type { Profile } from '$lib/models/accounts';
    import { goto } from '$app/navigation';
    import { searchKindDefaultKey } from '$lib/models/content/search-kind.enum';
    import { searchMatchDefaultKey } from '$lib/models/content/search-match.enum';
    import { onMount } from 'svelte';

    const searchKindOptions = Object.entries(SearchKind).map(([key, value]) => ({
        value: key,
        label: value,
    }))

    const anyOption = "Any"

    const categoryOptions: Array<any> = Object.entries(WorkKind).map(([key, value]) => ({
        value: key,
        label: value,
    })).sort((a, b) => (a.value < b.value ? -1 : 1))
    categoryOptions.push({
        value: anyOption,
        label: anyOption,
    })

    const genreMatchOptions = Object.entries(SearchMatch).map(([key, value]) => ({
        value: key,
        label: value,
    }))
    const genreOptions = Object.entries(Genres).map(([key, value]) => ({
        value: key,
        label: value,
    })).sort((a, b) => (a.value < b.value ? -1 : 1))

    const tagMatchOptions = Object.entries(SearchMatch).map(([key, value]) => ({
        value: key,
        label: value,
    }))

    let searchResultWorks: PaginateResult<Content>;
    let searchResultBlogs: PaginateResult<Content>;
    let searchResultUsers: PaginateResult<Profile>;

    let loading = false;

    let tagOptions = [];

    let currentQuery: string
    let queryValue: string

    let currentSearchKindKey: string
    let searchKindValue: any

    let showAdvancedOptions: boolean

    let currentAuthor: string
    let authorValue: string

    let currentCategoryKey: string
    let categoryValue: any

    let currentGenreSearchMatchKey: string
    let genreSearchMatchValue: any

    let currentGenreKeys: string[]
    let genreValues: any[]

    let currentTagSearchMatchKey: string
    let tagSearchMatchValue: any

    let currentTagKeys: string[]
    let tagValues: any[]

    let currentIncludeChildTags: boolean
    let includeChildTagsValue: boolean

    let showIncludeChildTags: boolean

    let currentPage = 1

    /*onMount(() => {
        tags.fetchTagsTrees(TagKind.Fandom).subscribe((tagTrees) => {
            for (const tree of tagTrees) {
                tagOptions = [...tagOptions, ({ value: tree._id, label: tree.name, isParent: (tree.children.length > 0) })]
                for (const child of tree.children) {
                    tagOptions = [...tagOptions, ({ value: child._id, label: tree.name + "  —  " + child.name, isParent: false })]
                }
            }
        })
        // This has to be after tag options or else tag options aren't placed in the form
        //processQueryParams()
    })*/

    function processQueryParams() {
        const searchParams = $page.url.searchParams
        let shouldSearch = false

        currentQuery = searchParams.has('query') ?
            searchParams.get('query') :
            null
        queryValue = currentQuery

        if (currentQuery) {
            shouldSearch = true
        }

        if (searchParams.has('author') || searchParams.has('category')
            || searchParams.has('genres') || searchParams.has('tags')) {
            showAdvancedOptions = true
            shouldSearch = true
        }

        currentSearchKindKey = searchParams.has('kind') ?
            parseSearchKindKey(searchParams.get('kind')) :
            searchKindDefaultKey
        searchKindValue = createSearchKindMenuItem(currentSearchKindKey)

        currentAuthor = searchParams.has('author') ?
            searchParams.get('author') :
            null
        authorValue = currentAuthor

        currentCategoryKey = searchParams.has('category') ?
            parseCategoryKey(searchParams.get('category')) :
            anyOption
        categoryValue = createCategoryMenuItem(currentCategoryKey)

        currentGenreSearchMatchKey = searchParams.has('genreSearchMatch') ?
            parseMatchKey(searchParams.get('genreSearchMatch')) :
            searchMatchDefaultKey
        genreSearchMatchValue = createMatchMenuItem(currentGenreSearchMatchKey)

        currentGenreKeys = searchParams.has('genres') ?
            parseGenreKeys(searchParams.get('genres').split(',')) :
            null
        genreValues = createGenreMenuItems(currentGenreKeys)

        currentTagSearchMatchKey = searchParams.has('tagSearchMatch') ?
            parseMatchKey(searchParams.get('tagSearchMatch')) :
            searchMatchDefaultKey
        tagSearchMatchValue = createMatchMenuItem(currentTagSearchMatchKey)

        currentTagKeys = searchParams.has('tags') ?
            searchParams.get('tags').split(',') :
            null
        tagValues = createTagMenuItems(currentTagKeys)

        currentIncludeChildTags = searchParams.get('includeChildTags') !== 'false'
        includeChildTagsValue = currentIncludeChildTags

        showIncludeChildTags = searchParams.has('includeChildTags')

        if (searchParams.has('page')) {
            currentPage = +searchParams.get('page')
            shouldSearch = true
        }

        if (shouldSearch) {
            fetchData()
        }
    }

    function updateUrl() {
        const newSearchParams = new URLSearchParams()
        if (currentQuery) {
            newSearchParams.set('query', currentQuery)
        }
        if (currentSearchKindKey && SearchKind[currentSearchKindKey] !== SearchKind.ProseAndPoetry) {
            newSearchParams.set('kind', currentSearchKindKey)
        }
        if (currentSearchKindKey !== SearchKind.User) {
            if (currentAuthor) {
                newSearchParams.set('author', currentAuthor)
            }
            if (currentCategoryKey && currentCategoryKey !== anyOption) {
                newSearchParams.set('category', currentCategoryKey)
            }
            if (currentGenreKeys && currentGenreKeys.length > 0) {
                if (currentGenreSearchMatchKey && SearchMatch[currentGenreSearchMatchKey] !== SearchMatch.All) {
                    newSearchParams.set('genreSearchMatch', currentGenreSearchMatchKey)
                }
                newSearchParams.set('genres', currentGenreKeys.toString())
            }
            if (currentTagKeys && currentTagKeys.length > 0) {
                if (currentTagSearchMatchKey && SearchMatch[currentTagSearchMatchKey] !== SearchMatch.All) {
                    newSearchParams.set('tagSearchMatch', currentTagSearchMatchKey)
                }
                newSearchParams.set('tags', currentTagKeys.toString())
                if (showIncludeChildTags) {
                    newSearchParams.set('includeChildTags', currentIncludeChildTags.toString())
                }
            }
        }
        if (currentPage > 0) {
            newSearchParams.set('page', currentPage.toString())
        }
        goto("/search?" + newSearchParams.toString())
    }

    function setNewPage(pageNum: number) {
        currentPage = pageNum;
        updateUrl()
        fetchData()
    }

    function setShowIncludeChildTags() {
        if (tagValues && tagSearchMatchValue.label !== SearchMatch.Exactly) {
            for (const tag of tagValues) {
                if (tag.isParent) {
                    showIncludeChildTags = true;
                    return;
                }
            }
        }
        showIncludeChildTags = false;
    }

    function clearResults() {
        searchResultWorks = null;
        searchResultBlogs = null;
        searchResultUsers = null;
    }

    function fetchData() {
        loading = true;
        clearResults();
        switch(SearchKind[currentSearchKindKey]) {
            case SearchKind.Blog:
                search.findRelatedContent(
                    currentQuery,
                    currentSearchKindKey,
                    currentAuthor,
                    currentCategoryKey,
                    currentGenreSearchMatchKey,
                    currentGenreKeys,
                    currentTagSearchMatchKey,
                    currentTagKeys,
                    currentIncludeChildTags,
                    currentPage,
                    $app.filter,
                ).subscribe((results) => {
                    searchResultBlogs = results;
                    loading = false;
                })
                break;
            case SearchKind.User:
                search.searchUsers(currentQuery, currentPage).subscribe((results) => {
                    searchResultUsers = results;
                    loading = false;
                });
                break;
            case SearchKind.Poetry:
            case SearchKind.ProseAndPoetry:
            case SearchKind.Prose:
            default:
                search.findRelatedContent(
                    currentQuery,
                    currentSearchKindKey,
                    currentAuthor,
                    currentCategoryKey,
                    currentGenreSearchMatchKey,
                    currentGenreKeys,
                    currentTagSearchMatchKey,
                    currentTagKeys,
                    currentIncludeChildTags,
                    currentPage,
                    $app.filter,
                ).subscribe((results) => {
                    searchResultWorks = results;
                    loading = false;
                });
        }
    }

    const { form, data, errors } = createForm({
        onSubmit: async (values) => {
            currentQuery = values.query ?? null
            currentSearchKindKey = parseSearchKindKey(searchKindValue)
            currentAuthor = values.author ?? null
            currentCategoryKey = parseCategoryKey(categoryValue)
            currentGenreSearchMatchKey = parseMatchKey(genreSearchMatchValue)
            currentGenreKeys = parseGenreKeys(genreValues)
            currentTagSearchMatchKey = parseMatchKey(tagSearchMatchValue)
            currentTagKeys = tagValues ? tagValues.map((val) => {
                return val.value as string
            }) : null
            currentIncludeChildTags = includeChildTagsValue
            currentPage = 1

            updateUrl()
            fetchData()
        },
    });

    /**
     * Takes either a string key or an object of format (value, label) where value is a string key
     * @param kindKey
     * @returns The provided key as a string if it's valid, or "ProseAndPoetry" if it isn't
     */
    function parseSearchKindKey(kindKey: any): string {
        let kindString: string
        if (typeof kindKey === 'string') {
            kindString = kindKey
        } else {
            kindString = kindKey ? kindKey.value : null
        }
        const kind: SearchKind = SearchKind[kindString]
        return Object.values(SearchKind).indexOf(kind) >= 0 ? kindString : searchKindDefaultKey
    }

    /**
     * For use in the form menu
     * @param kindKey
     * @returns The provided key and its SearchKind value as an object of the form {value, label}
     */
    function createSearchKindMenuItem(kindKey: string) {
        return {value: kindKey, label: SearchKind[kindKey]}
    }

    /**
     * Takes either a string key or an object of format (value, label) where value is a string key
     * Categories are stored for works via their keys, so we want to return the key instead of the value
     * @param categoryKey
     * @returns The provided key as a string if it's valid, or "Any" if it isn't
     */
    function parseCategoryKey(categoryKey: any): string {
        let categoryString: string
        if (typeof categoryKey === 'string') {
            categoryString = categoryKey
        } else {
            categoryString = categoryKey ? categoryKey.value : anyOption
        }
        const category: WorkKind = WorkKind[categoryString]
        return Object.values(WorkKind).indexOf(category) >= 0 ? categoryString : anyOption
    }

    /**
     * For use in the form menu
     * @param categoryKey
     * @returns The provided key and its WorkKind value as an object of the form {value, label}
     */
    function createCategoryMenuItem(categoryKey: string) {
        return {value: categoryKey, label: WorkKind[categoryKey]}
    }

    /**
     * Takes either a string key or an object of format (value, label) where value is a string key
     * Matches are made using the key, so we want to return the key instead of the value
     * @param matchKey
     * @returns The provided key as a string if it's valid, or "All" if it isn't
     */
    function parseMatchKey(matchKey: any): string {
        let matchString: string
        if (typeof matchKey === 'string') {
            matchString = matchKey
        } else {
            matchString = matchKey ? matchKey.value : null
        }
        const match: SearchMatch = SearchMatch[matchString]
        return Object.values(SearchMatch).indexOf(match) >= 0 ? matchString : searchMatchDefaultKey
    }

    /**
     * For use in the form menu
     * @param matchKey
     * @returns The provided key and its SearchMatch value as an object of the form {value, label}
     */
    function createMatchMenuItem(matchKey: string) {
        return {value: matchKey, label: SearchMatch[matchKey]}
    }

    /**
     * Takes either an array of string keys
     * or an array of objects of format (value, label) where value is a string key
     * Genres are stored for works via their keys, so we want to return the key values instead of the labels
     * (i.e. ScienceFiction instead of Science Fiction)
     * @param genreKeys
     * @returns Array of all the valid keys provided, as a string array
     */
    function parseGenreKeys(genreKeys: any[]): string[] {
        const genreList: string[] = [];
        if (genreKeys) {
            for (const genreKey of genreKeys) {
                let genreString: string
                if (typeof genreKey === 'string') {
                    genreString = genreKey
                } else {
                    genreString = genreKey.value
                }
                if (Object.values(Genres).indexOf(Genres[genreString]) >= 0) {
                    genreList.push(genreString);
                }
            }
        }

        return genreList;
    }

    /**
     * For use in the form menu
     * @param genreKeys
     * @returns The provided keys and their Genre values as objects of the form {value, label}
     */
    function createGenreMenuItems(genreKeys: string[]) {
        if (genreKeys) {
            return genreKeys.map((value) => ({value: value, label: Genres[value]}))
        }
        return null
    }

    /**
     * For use in the form menu
     * @param tagKeys
     * @returns The tags for the provided keys as objects of the form {value, label, isParent}
     */
    function createTagMenuItems(tagKeys: string[]) {
        if (tagKeys) {
            const tagMenuItems: any[] = []
            for (const tag of tagKeys) {
                for (const tagOption of tagOptions) {
                    if (tag === tagOption.value) {
                        tagMenuItems.push(tagOption)
                    }
                }
            }
            if (tagMenuItems.length > 0) {
                return tagMenuItems
            }
        }
        return null
    }
</script>

<!--<div class="flex flex-col md:flex-row w-full h-screen">
    <PageNav>
        <svelte:fragment slot="header">
            <h3>Search</h3>
            <TeamLine />
        </svelte:fragment>

        <svelte:fragment slot="pages">
            <form use:form>
                <TextField
                    name="query"
                    type="text"
                    title="Query"
                    placeholder="Search..."
                    value={queryValue}
                    errorMessage={$errors.query}
                />
                <Button type="submit">
                    <span class="button-text">Search</span>
                </Button>

                <SelectMenu
                    items={searchKindOptions}
                    label="Search Kind"
                    value={searchKindValue}
                    on:select={(e) => {
                        $data.searchKind = e.detail
                        searchKindValue = e.detail
                    }}
                />
                {#if showAdvancedOptions}
                    <div on:click={() => showAdvancedOptions = false}>Hide Advanced</div>
                    {#if (searchKindValue && searchKindValue.label !== SearchKind.User)}
                        <TextField
                            name="author"
                            type="text"
                            title="Author"
                            placeholder="Search..."
                            value={authorValue}
                            errorMessage={$errors.author}
                        />
                        <SelectMenu
                            items={categoryOptions}
                            label="Category"
                            value={categoryValue}
                            on:select={(e) => {
                                $data.category = e.detail
                                categoryValue = e.detail
                            }}
                        />
                        <div>Genre(s)</div>
                        <SelectMenu
                            items={genreMatchOptions}
                            label="Genre Search Match"
                            value={genreSearchMatchValue}
                            on:select={(e) => {
                                $data.genreSearchMatch = e.detail
                                genreSearchMatchValue = e.detail
                            }}
                        />
                        <SelectMenu
                            items={genreOptions}
                            label="Genre Search"
                            isMulti={true}
                            value={genreValues}
                            on:select={(e) => {
                                $data.genres = e.detail
                                genreValues = e.detail
                            }}
                        />
                        <div>Fandom Tag(s)</div>
                        <SelectMenu
                            items={tagMatchOptions}
                            label="Tag Search Match"
                            value={tagSearchMatchValue}
                            on:select={(e) => {
                                $data.tagSearchMatch = e.detail
                                tagSearchMatchValue = e.detail
                                setShowIncludeChildTags()
                            }}
                        />
                        <SelectMenu
                            items={tagOptions}
                            label="Tag Search"
                            isMulti={true}
                            value={tagValues}
                            on:select={(e) => {
                                $data.tags = e.detail
                                tagValues = e.detail
                                setShowIncludeChildTags()
                            }}
                        />
                        {#if showIncludeChildTags}
                            <Toggle
                                bind:value={includeChildTagsValue}
                            >
                                Include child tags
                            </Toggle>
                        {/if}
                    {/if}
                {:else}
                    <div on:click={() => showAdvancedOptions = true}>Show Advanced</div>
                {/if}
            </form>
        </svelte:fragment>
    </PageNav>

    {#if loading}
        <div class="w-full h-screen flex flex-col items-center justify-center">
            <div class="flex items-center">
                <Loader5Line class="animate-spin mr-2" size="32px" />
                <span class="uppercase font-bold tracking-widest">Loading...</span>
            </div>
        </div>
    {:else}
        <div class="w-full overflow-y-auto">
            <div class="w-11/12 mx-auto my-6 max-w-7xl">
                {#if searchResultWorks}
                    <div class="flex flex-row py-4 items-center">
                        <h3 class="text-4xl font-medium">Works</h3>
                    </div>
                    <div
                        class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 mb-6"
                    >
                        {#each searchResultWorks.docs as work}
                            <WorkCard content={work} />
                        {/each}
                    </div>
                    <Paginator
                        currPage={currentPage}
                        totalPages={searchResultWorks.totalPages}
                        on:change={(e) => setNewPage(e.detail)}
                    />
                {/if}
                {#if searchResultBlogs}
                    <div class="flex flex-row py-4 items-center">
                        <h3 class="text-4xl font-medium">Blogs</h3>
                    </div>
                    <div
                        class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 mb-6"
                    >
                        {#each searchResultBlogs.docs as blog}
                            <BlogCard blog={blog} />
                        {/each}
                    </div>
                    <Paginator
                        currPage={currentPage}
                        totalPages={searchResultBlogs.totalPages}
                        on:change={(e) => setNewPage(e.detail)}
                    />
                {/if}
                {#if searchResultUsers}
                    <div class="flex flex-row py-4 items-center">
                        <h3 class="text-4xl font-medium">Users</h3>
                    </div>
                    <div
                        class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 mb-6"
                    >
                        {#each searchResultUsers.docs as user}
                            <BlogCard blog={blog} />
                        {/each}
                    </div>
                    <Paginator
                        currPage={currentPage}
                        totalPages={searchResultUsers.totalPages}
                        on:change={(e) => setNewPage(e.detail)}
                    />
                {/if}
            </div>
        </div>
    {/if}
</div>-->

<slot />