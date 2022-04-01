<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';
    import { setCurrSection } from '$lib/repo/content.repo';

    export const load: Load = ({ params }) => {
        const sectionId = params.sectionId;
        setCurrSection(sectionId);
        console.log(`route hit!`);
        return {
            props: {
                sectionId,
            },
        };
    };
</script>

<script lang="ts">
    import { fly } from 'svelte/transition';
    import { createForm } from 'felte';
    import { goto } from '$app/navigation';
    import { session } from '$lib/repo/session.repo';
    import { auth } from '$lib/services';
    import { updateSection, content } from '$lib/repo/content.repo';
    import { MAX_TITLE_LENGTH, MIN_LONG_DESC_LENGTH, MIN_TITLE_LENGTH, slugify } from '$lib/util';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import {
        ArrowLeftSLine,
        BookmarkLine,
        CheckboxBlankCircleLine,
        CheckboxCircleLine,
        CloseLine,
        Edit2Line,
        FontSize,
        ListUnordered,
        Save2Line,
        ArrowUpLine,
        ArrowDownLine,
    } from 'svelte-remixicon';
    import { SectionForm } from '$lib/models/content/works';
    import { AuthorsNotePos } from '$lib/models/content';
    import { editSection } from '$lib/services/content.service';
    import TextField from '$lib/components/forms/TextField.svelte';
    import Editor from '$lib/components/forms/Editor.svelte';

    let chapterListShown = false;
    let editMode = false;
    let baseUrl: string;
    let selectedPos = $content.currSection.authorsNotePos
        ? $content.currSection.authorsNotePos
        : AuthorsNotePos.Bottom;

    if ($content.content.kind === 'ProseContent') {
        baseUrl = `/prose/${$content.content._id}`;
    } else {
        baseUrl = `/poetry/${$content.content._id}`;
    }

    function hasAuthorsNote() {
        return (
            $content.currSection.authorsNote &&
            $content.currSection.authorsNotePos &&
            $content.currSection.authorsNotePos === AuthorsNotePos.Bottom
        );
    }

    const { form, data, errors, createSubmitHandler } = createForm({
        onSubmit: (values) => {
            console.log(values);
        },
        validate: (values) => {
            const errors = {
                title: '',
                body: '',
                authorsNote: '',
            };

            if (values.title.length < MIN_TITLE_LENGTH || values.title.length > MAX_TITLE_LENGTH) {
                errors.title = `Titles must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters long`;
            }

            if (values.body.length < MIN_LONG_DESC_LENGTH) {
                errors.body = `Body text must be, at minimum, ${MIN_LONG_DESC_LENGTH} characters long`;
            }

            if (values.authorsNote && values.authorsNote.length < MIN_LONG_DESC_LENGTH) {
                errors.authorsNote = `Author's Notes must be, at minimum, ${MIN_LONG_DESC_LENGTH} characters long`;
            }

            return errors;
        },
        initialValues: {
            title: $content.currSection.title,
            body: $content.currSection.body,
            authorsNote: $content.currSection.authorsNote,
        },
    });

    const saveSection = createSubmitHandler({
        onSubmit: async (values) => {
            const formData: SectionForm = {
                title: values.title,
                body: values.body,
                authorsNote:
                    values.authorsNote && values.authorsNote !== ''
                        ? values.authorsNote
                        : undefined,
                authorsNotePos: selectedPos,
                oldWords: $content.currSection.stats.words,
            };

            await editSection(
                $session.currProfile._id,
                $content.content._id,
                $content.currSection._id,
                formData,
            ).then((section) => {
                updateSection(section);
                editMode = false;
            });
        },
    });
</script>

<svelte:head>
    {#if $content.content}
        <title>{$content.content.title} &mdash; Offprint</title>
        <!-- Primary Meta Tags -->
        <meta name="title" content={$content.content.title} />
        <meta name="description" content={$content.content.desc} />

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://offprint.net/prose/{$content.content._id}" />
        <meta property="og:title" content={$content.content.title} />
        <meta property="og:description" content={$content.content.desc} />
        <meta
            property="og:image"
            content={$content.content.meta.coverArt
                ? $content.content.meta.coverArt
                : $content.content.author.profile.avatar}
        />

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://offprint.net/prose/{$content.content._id}" />
        <meta property="twitter:title" content={$content.content.title} />
        <meta property="twitter:description" content={$content.content.desc} />
        <meta
            property="twitter:image"
            content={$content.content.meta.coverArt
                ? $content.content.meta.coverArt
                : $content.content.author.profile.avatar}
        />
    {/if}
</svelte:head>

<div class="w-full h-screen overflow-y-auto">
    <div class="flex flex-col w-full">
        <div
            class="sticky top-0 flex items-center w-full p-2.5 shadow-2xl z-10 h-[56px]"
            style="background: var(--accent)"
        >
            <Button kind="primary" on:click={() => goto(baseUrl)}>
                <ArrowLeftSLine class="button-icon" />
                <span class="button-text">Back</span>
            </Button>
            <div class="mx-1"><!--separator--></div>
            <Button kind="primary">
                <FontSize class="button-icon" />
                <span class="button-text">Formatting</span>
            </Button>
            <div
                class="flex-1 flex items-center justify-center uppercase text-sm relative top-0.5 font-bold tracking-widest"
            >
                {$content.content.title}
            </div>
            {#if editMode}
                <Button kind="primary" on:click={() => (editMode = !editMode)}>
                    <CloseLine class="button-icon" />
                    <span class="button-text">Cancel</span>
                </Button>
                <div class="mx-1"><!--separator--></div>
                <Button kind="primary" on:click={saveSection}>
                    <Save2Line class="button-icon" />
                    <span class="button-text">Save</span>
                </Button>
            {:else}
                <Button
                    kind="primary"
                    on:click={() => (chapterListShown = !chapterListShown)}
                    isActive={chapterListShown}
                >
                    <ListUnordered class="button-icon" />
                    <span class="button-text">Chapters</span>
                </Button>
                <div class="mx-1"><!--separator--></div>
                {#if $session.account && auth.checkProfile($content.content.author, $session.account)}
                    <Button kind="primary" on:click={() => (editMode = !editMode)}>
                        <Edit2Line class="button-icon" />
                        <span class="button-text">Edit</span>
                    </Button>
                {:else}
                    <Button kind="primary">
                        <BookmarkLine class="button-icon" />
                        <span class="button-text">Mark</span>
                    </Button>
                {/if}
            {/if}
        </div>
        <div class="flex w-full">
            <div class="section-container">
                <div class="w-11/12 mx-auto md:max-w-3xl my-6 flex-1">
                    {#if editMode}
                        <form use:form>
                            <TextField
                                name="title"
                                type="text"
                                title="Title"
                                placeholder="A Start To A Wonderful Adventure"
                                errorMessage={$errors.title}
                            />
                            <Editor label="Body" bind:value={$data.body} />
                            <div
                                class="flex items-center mt-6 mb-4 pb-1 border-b border-zinc-700 dark:border-white"
                            >
                                <h3 class="text-2xl font-medium flex-1">Author's Note Position</h3>
                                <Button
                                    isActive={selectedPos === AuthorsNotePos.Top}
                                    on:click={() => (selectedPos = AuthorsNotePos.Top)}
                                >
                                    <ArrowUpLine class="button-icon" />
                                    <span class="button-text">Above</span>
                                </Button>
                                <div class="mx-1"><!--separator--></div>
                                <Button
                                    isActive={selectedPos === AuthorsNotePos.Bottom}
                                    on:click={() => (selectedPos = AuthorsNotePos.Bottom)}
                                >
                                    <ArrowDownLine class="button-icon" />
                                    <span class="button-text">Below</span>
                                </Button>
                            </div>
                            <Editor label="Author's Note" bind:value={$data.authorsNote} />
                        </form>
                    {:else}
                        {#if $content.currSection.authorsNote && $content.currSection.authorsNotePos && $content.currSection.authorsNotePos === AuthorsNotePos.Top}
                            <div
                                class="rounded-lg bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed p-4"
                            >
                                <h3 class="font-medium text-2xl mb-6">
                                    A note from the author&mdash;
                                </h3>
                                {@html $content.currSection.authorsNote}
                            </div>
                        {/if}
                        <h1
                            class="border-b border-zinc-700 dark:border-white w-full text-4xl font-medium mb-8"
                        >
                            {$content.currSection.title}
                        </h1>
                        {@html $content.currSection.body}
                        {#if $content.currSection.authorsNote && $content.currSection.authorsNotePos && $content.currSection.authorsNotePos === AuthorsNotePos.Bottom}
                            <div
                                class="rounded-lg bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed p-4"
                            >
                                <h3 class="font-medium text-2xl mb-6">
                                    A note from the author&mdash;
                                </h3>
                                {@html $content.currSection.authorsNote}
                            </div>
                        {/if}
                    {/if}
                </div>
            </div>
            {#if chapterListShown}
                <div
                    class="chapter-list bg-zinc-300 dark:bg-zinc-700"
                    transition:fly={{ delay: 0, duration: 150, x: 100 }}
                >
                    <ul>
                        {#if $session.account && auth.checkProfile($content.content.author, $session.account)}
                            {#each $content.sections as section}
                                <li class:active={section._id === $content.currSection._id}>
                                    <a
                                        class="w-full px-2.5 flex items-center"
                                        href="{baseUrl}/section/{section._id}"
                                    >
                                        {#if section.published}
                                            <CheckboxCircleLine class="mr-2" />
                                        {:else}
                                            <CheckboxBlankCircleLine class="mr-2" />
                                        {/if}
                                        {section.title}
                                    </a>
                                </li>
                            {/each}
                        {:else}
                            {#each $content.sections.filter((value) => value.published === true) as section}
                                <li class:active={section._id === $content.currSection._id}>
                                    <a class="w-full px-2.5" href="{baseUrl}/section/{section._id}"
                                        >{section.title}</a
                                    >
                                </li>
                            {/each}
                        {/if}
                    </ul>
                </div>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    div.section-container {
        @apply w-full overflow-y-auto;
        height: calc(100vh - 56px);
    }
    div.chapter-list {
        @apply w-96 p-4;
        height: calc(100vh - 56px);
        li {
            @apply flex items-center h-10 odd:bg-zinc-400 odd:dark:bg-zinc-600 w-full truncate text-sm transition transform;
            a {
                @apply no-underline;
                color: var(--text-color);
            }
            &.active {
                @apply text-white;
                background: var(--accent) !important;
                &:hover {
                    background: var(--accent-light) !important;
                }
            }
            &:hover {
                @apply text-white;
                background: var(--accent) !important;
            }
        }
    }
</style>
