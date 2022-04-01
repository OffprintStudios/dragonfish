<script lang="ts">
    import { goto } from '$app/navigation';
    import { content, togglePubStatus } from '$lib/repo/content.repo';
    import { session } from '$lib/repo/session.repo';
    import { auth } from '$lib/services';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import {
        AddBoxLine,
        CheckboxBlankCircleLine,
        CheckboxCircleLine,
        DeleteBinLine,
    } from 'svelte-remixicon';

    export let baseUrl = `/prose`;

    async function toggleStatus(sectionId: string, currStatus: boolean) {
        await togglePubStatus(
            $session.currProfile._id,
            $content.content._id,
            sectionId,
            currStatus,
        );
    }
</script>

<div>
    <div class="flex items-center border-b border-zinc-700 dark:border-white pb-1">
        <h3 class="text-2xl font-medium flex-1">Chapters</h3>
        {#if $session.account && auth.checkProfile($content.content.author, $session.account)}
            <Button on:click={() => goto(`${baseUrl}/create-section`)}>
                <AddBoxLine class="button-icon" />
                <span class="button-text">Chapter</span>
            </Button>
        {/if}
    </div>
    <div class="w-full max-h-96 overflow-y-auto mb-6">
        {#if $content.sections.length === 0}
            <div class="empty">
                <h3>Nothing's been added yet!</h3>
                <p>
                    If you're the author, hit the Add Chapter button in this section to hit the
                    ground running!
                </p>
            </div>
        {:else}
            <ul class="mt-4">
                {#if $session.account && auth.checkProfile($content.content.author, $session.account)}
                    {#each $content.sections as section}
                        <li class="section-item odd:bg-zinc-300 odd:dark:bg-zinc-700">
                            {#if section.published}
                                <button
                                    on:click={async () =>
                                        await toggleStatus(section._id, section.published)}
                                >
                                    <CheckboxCircleLine class="button-icon no-text" />
                                </button>
                            {:else}
                                <button
                                    on:click={async () =>
                                        await toggleStatus(section._id, section.published)}
                                >
                                    <CheckboxBlankCircleLine class="button-icon no-text" />
                                </button>
                            {/if}
                            <a href="{baseUrl}/section/{section._id}">
                                <span class="title">{section.title}</span>
                                <span class="words">{section.stats.words} words</span>
                            </a>
                            <button>
                                <DeleteBinLine class="button-icon no-text" />
                            </button>
                        </li>
                    {/each}
                {:else}
                    {#each $content.sections.filter((item) => {
                        return item.published === true;
                    }) as section}
                        <li class="section-item odd:bg-zinc-300 odd:dark:bg-zinc-700">
                            <a href="{baseUrl}/section/{section._id}">
                                <span class="title">{section.title}</span>
                                <span class="words">{section.stats.words} words</span>
                            </a>
                        </li>
                    {/each}
                {/if}
            </ul>
        {/if}
    </div>
</div>

<style lang="scss">
    li.section-item {
        @apply w-full flex h-10;
        a {
            @apply flex-1 flex items-center no-underline text-sm transition transform h-full px-2;
            color: var(--text-color);
            span.title {
                @apply flex-1;
            }
            &:hover {
                background: var(--accent);
                @apply text-white;
            }
        }
        button {
            @apply h-full px-3 flex items-center;
            &:hover {
                @apply text-white;
                background: var(--accent);
            }
        }
    }
</style>
