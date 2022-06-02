<script lang="ts">
    import { useMutation, useQuery } from '@sveltestack/svelte-query';
    import { goto } from '$app/navigation';
    import { content } from '$lib/repo/content.repo';
    import { session } from '$lib/repo/session.repo';
    import { auth } from '$lib/services';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import {
        AddBoxLine,
        CheckboxBlankCircleLine,
        CheckboxCircleLine,
        CloseLine,
        DeleteBinLine,
        Loader5Line,
    } from 'svelte-remixicon';
    import { deleteSection, fetchSections, publishSection } from '$lib/services/content.service';
    import { localeDate, queryClient } from '$lib/util';
    import type { PublishSection, Section } from '$lib/models/content/works';
    import { openPopup, PopupOnConfirm } from '$lib/components/nav/popup';
    import ConfirmDeleteSection from './ConfirmDeleteSection.svelte';
    import { success } from '$lib/services/alerts.service';

    export let baseUrl = `/prose`;

    const sections = useQuery('contentSections', () =>
        fetchSections(
            $content.content._id,
            $session.currProfile && $content.content.author._id === $session.currProfile._id
                ? $session.currProfile._id
                : null,
        ),
        {
            enabled: !!$session && !!$content && !!$content.content,
        });

    const toggleStatus = useMutation((section: Section) => requestSectionPublish(section), {
        onSuccess: (data) => {
            queryClient.setQueryData('contentSections', (oldData: Section[]) => {
                const index = oldData.findIndex((item) => item._id === data._id);
                oldData[index] = data;
                return oldData;
            });
        },
    });

    async function requestSectionPublish(section: Section) {
        const newStatus: PublishSection = {
            oldPub: section.published,
            newPub: !section.published,
        };

        return await publishSection(
            $session.currProfile._id,
            $content.content._id,
            section._id,
            newStatus,
        ).then((data) => {
            if (newStatus.oldPub === false && data.published === true) {
                $content.content.stats.words += data.stats.words;
            } else if (newStatus.oldPub === true && data.published === false) {
                $content.content.stats.words -= data.stats.words;
            }
            return data;
        });
    }

    class OnConfirmDelete implements PopupOnConfirm {
        section: Section;

        constructor(section: Section) {
            this.section = section;
        }

        async onConfirm(): Promise<void> {
            const wasPublished = this.section.published;
            const words = this.section.stats.words;
            const id = this.section._id;

            await deleteSection(
                $session.currProfile._id,
                $content.content._id,
                this.section._id,
            ).then(() => {
                if (wasPublished) {
                    $content.content.stats.words -= words;
                }
                queryClient.setQueryData('contentSections', (oldData: Section[]) => {
                    return oldData.filter((item) => item._id !== id)
                });
                success(`Section deleted!`);
            });
        }
    }
</script>

{#if $session && $content && $content.content}
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
            {#if !$sections || $sections.isLoading}
                <div class="flex flex-col h-full w-full items-center justify-center">
                    <div class="flex items-center">
                        <Loader5Line class="animate-spin mr-2" size="24px" />
                        <span class="uppercase font-bold tracking-widest">Loading...</span>
                    </div>
                </div>
            {:else if $sections.isError}
                <div class="flex flex-col h-full w-full items-center justify-center">
                    <div class="flex items-center">
                        <CloseLine class="mr-2" size="24px" />
                        <span class="uppercase font-bold tracking-widest">Error fetching sections!</span
                        >
                    </div>
                </div>
            {:else if $sections.data.length === 0}
                <div class="empty">
                    <h3>Nothing's been added yet!</h3>
                    <p>
                        If you're the author, hit the Add Chapter button in this section to hit the
                        ground running!
                    </p>
                </div>
            {:else}
                <ul class="mt-4">
                    {#each $sections.data as section}
                        <li class="section-item odd:bg-zinc-300 odd:dark:bg-zinc-700">
                            {#if $session.currProfile && $session.currProfile._id === $content.content.author._id}
                                {#if section.published}
                                    <button on:click={() => $toggleStatus.mutate(section)}>
                                        <CheckboxCircleLine class="button-icon no-text" />
                                    </button>
                                {:else}
                                    <button on:click={() => $toggleStatus.mutate(section)}>
                                        <CheckboxBlankCircleLine class="button-icon no-text" />
                                    </button>
                                {/if}
                            {/if}
                            <a href="{baseUrl}/section/{section._id}">
                                <span class="title">{section.title}</span>
                                <span class="words">{section.stats.words} words</span>
                                <span class="mx-1">•</span>
                                {#if section.audit.publishedOn}
                                    <span>{localeDate(section.audit.publishedOn, 'shortDate')}</span>
                                {:else}
                                    <span>{localeDate(section.createdAt, 'shortDate')}</span>
                                {/if}
                            </a>
                            {#if $session.currProfile && $session.currProfile._id === $content.content.author._id}
                                <button on:click={() => openPopup(ConfirmDeleteSection, new OnConfirmDelete(section))}>
                                    <DeleteBinLine class="button-icon no-text" />
                                </button>
                            {/if}
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </div>
{/if}

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
