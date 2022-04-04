<script lang="ts">
    import { ArrowLeftSLine, ArrowRightSLine } from 'svelte-remixicon';
    import { createEventDispatcher } from 'svelte';

    const PAGE_BUFFER = 2;
    export let currPage: number;
    export let totalPages: number;

    const dispatch = createEventDispatcher();

    function range(size, startAt = 0) {
        return [...Array(size).keys()].map((i) => i + startAt);
    }

    function changePage(page: number) {
        if (page !== currPage) {
            dispatch('change', page);
        }
    }
</script>

<div class="pagination">
    <ul
        class="rounded-full bg-zinc-300 dark:bg-zinc-700 highlight-shadowed-black dark:highlight-shadowed"
    >
        <li class="ml-0" class:disabled={currPage === 1}>
            <button on:click={() => changePage(currPage - 1)} disabled={currPage === 1}>
                <ArrowLeftSLine size="28px" />
            </button>
        </li>
        {#if totalPages <= 10}
            {#each range(totalPages, 1) as page}
                <li class:active={page === currPage} class="hidden md:block">
                    <button on:click={() => changePage(page)}>
                        {page}
                    </button>
                </li>
            {/each}
        {:else}
            <!--If current page is close enough to first page to display everything before and including it-->
            <!--1234(5) with buffer of 2 displays 1, the selected 5, the two before it, and also 2 because "..." takes up the same space-->
            {#if currPage <= PAGE_BUFFER + 3}
                {#each range(currPage, 1) as page}
                    <li class:active={page === currPage} class="hidden md:block">
                        <button on:click={() => changePage(page)}>
                            {page}
                        </button>
                    </li>
                {/each}
            <!--Otherwise, display 1 then "..." then the buffer before the current page, and current page-->
            {:else}
                <li class:active={false} class="hidden md:block">
                    <button on:click={() => changePage(1)}>
                        1
                    </button>
                </li>
                <li class:active={false} class="hidden md:block">
                    <button>
                        ...
                    </button>
                </li>
                {#each range(PAGE_BUFFER, currPage - PAGE_BUFFER) as page}
                    <li class:active={false} class="hidden md:block">
                        <button on:click={() => changePage(page)}>
                            {page}
                        </button>
                    </li>
                {/each}
                <li class:active={true} class="hidden md:block">
                    <button on:click={() => changePage(currPage)}>
                        {currPage}
                    </button>
                </li>
            {/if}
            <!--If current page is close enough to last page, then display everything after it-->
            <!--(5)6789 with buffer of 2 displays the two after the selected, the last, and also 8 because "..." takes up the same space-->
            {#if totalPages - currPage <= PAGE_BUFFER + 2}
                {#each range(totalPages - currPage, currPage + 1) as page}
                    <li class:active={false} class="hidden md:block">
                        <button on:click={() => changePage(page)}>
                            {page}
                        </button>
                    </li>
                {/each}
            <!--Otherwise displays buffer after current page, then "..." then last page-->
            {:else}
                {#each range(PAGE_BUFFER, currPage + 1) as page}
                    <li class:active={false} class="hidden md:block">
                        <button on:click={() => changePage(page)}>
                            {page}
                        </button>
                    </li>
                {/each}
                <li class:active={false} class="hidden md:block">
                    <button>
                        ...
                    </button>
                </li>
                <li class:active={false} class="hidden md:block">
                    <button on:click={() => changePage(totalPages)}>
                        {totalPages}
                    </button>
                </li>
            {/if}
        {/if}
        <li class="mr-0" class:disabled={currPage === totalPages}>
            <button on:click={() => changePage(currPage + 1)} disabled={currPage === totalPages}>
                <ArrowRightSLine size="28px" />
            </button>
        </li>
    </ul>
</div>

<style lang="scss">
    div.pagination {
        @apply w-full flex flex-col items-center justify-center my-6;
        ul {
            @apply text-center flex items-center justify-center;
            li {
                @apply mx-0.5;
                button {
                    @apply w-10 h-10 rounded-full transition transform flex items-center justify-center text-sm font-bold;
                    &:hover {
                        background: var(--accent);
                        @apply text-white;
                    }
                }
                &.active {
                    button {
                        background: var(--accent);
                        @apply text-white scale-110;
                        --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
                            0 4px 6px -4px rgb(0 0 0 / 0.1);
                        --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
                            0 4px 6px -4px var(--tw-shadow-color);
                        box-shadow: inset 0 1px 0 0 rgb(255 255 255/0.05),
                            var(--tw-ring-offset-shadow, 0 0 #0000),
                            var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
                    }
                }
                &.disabled {
                    button {
                        @apply cursor-not-allowed text-zinc-500;
                        &:hover {
                            @apply text-zinc-500 bg-transparent;
                        }
                    }
                }
            }
        }
    }
</style>
