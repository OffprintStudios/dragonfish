<script lang="ts">
    import { goto } from '$app/navigation';
    import { createForm } from 'felte';
    import { content } from '$lib/repo/content.repo';
    import { session } from '$lib/repo/session.repo';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { ArrowLeftSLine, Save2Line, ArrowDownLine, ArrowUpLine } from 'svelte-remixicon';
    import TextField from '$lib/components/forms/TextField.svelte';
    import Editor from '$lib/components/forms/Editor.svelte';
    import { AuthorsNotePos } from '$lib/models/content';
    import {
        MAX_TITLE_LENGTH,
        MIN_LONG_DESC_LENGTH,
        MIN_TITLE_LENGTH,
        queryClient,
    } from '$lib/util';
    import type { SectionForm } from '$lib/models/content/works';
    import { createSection, fetchSections } from '$lib/services/content.service';
    import { useMutation, useQuery } from '@sveltestack/svelte-query';
    import { success } from '$lib/services/alerts.service';

    let selectedPos = AuthorsNotePos.Bottom;
    let baseUrl: string;

    if ($content.content.kind === 'ProseContent') {
        baseUrl = `/prose/${$content.content._id}`;
    } else {
        baseUrl = `/poetry/${$content.content._id}`;
    }

    if (
        $session.currProfile &&
        $session.account &&
        $session.currProfile._id !== $content.content.author._id
    ) {
        goto(`${baseUrl}`);
    }

    if (!$session.currProfile && !$session.account) {
        goto(`${baseUrl}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sectionsList = useQuery(
        'contentSections',
        () => fetchSections($content.content._id, $session.currProfile._id),
        {
            enabled:
                !!$session.currProfile && $session.currProfile._id === $content.content.author._id,
        },
    );

    const addSection = useMutation(
        (formData: SectionForm) =>
            createSection($session.currProfile._id, $content.content._id, formData),
        {
            onSuccess: (data) => {
                queryClient.setQueryData('contentSections', (oldData) => [...oldData, data]);
                success(`Section created!`);
                goto(baseUrl);
            },
        },
    );

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
            title: '',
            body: '',
            authorsNote: '',
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
            };

            await $addSection.mutateAsync(formData);
        },
    });
</script>

<div class="w-full h-screen overflow-y-auto">
    <div class="flex flex-col w-full">
        <div class="sticky flex items-center w-full p-2.5 mb-6" style="background: var(--accent)">
            <Button kind="primary" on:click={() => goto(baseUrl)}>
                <ArrowLeftSLine class="button-icon" />
                <span class="button-text">Back</span>
            </Button>
            <div
                class="flex-1 text-center uppercase text-sm relative top-0.5 font-bold tracking-widest text-white"
            >
                Create a New Chapter
            </div>
            <Button kind="primary" on:click={saveSection}>
                <Save2Line class="button-icon" />
                <span class="button-text">Save</span>
            </Button>
        </div>
        <div class="w-11/12 mx-auto md:max-w-3xl mb-6">
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
        </div>
    </div>
</div>
