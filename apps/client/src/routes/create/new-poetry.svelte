<script lang="ts">
    import { goto } from '$app/navigation';
    import { createForm } from 'felte';
    import TextField from '$lib/components/forms/TextField.svelte';
    import SelectMenu from '$lib/components/forms/SelectMenu.svelte';
    import Editor from '$lib/components/forms/Editor.svelte';
    import { Genres, WorkKind, WorkStatus, PoetryFormKind, TagKind } from '$lib/models/content/works';
    import { ContentKind, ContentRating } from '$lib/models/content';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { CloseLine, Save2Line } from 'svelte-remixicon';
    import {
        MAX_TITLE_LENGTH,
        MIN_TITLE_LENGTH,
        MIN_GENRE,
        MAX_GENRES,
        MIN_SHORT_DESC_LENGTH,
        MAX_SHORT_DESC_LENGTH,
        MIN_LONG_DESC_LENGTH,
        MAX_FANDOM_TAGS,
    } from '$lib/util';
    import type { CreatePoetry } from '$lib/models/content/works/forms';
    import { createOne } from '$lib/services/content.service';
    import { session } from '$lib/repo/session.repo';
    import { onMount } from 'svelte';
    import { tags } from '$lib/services';

    var tagOptions = [];

    var categoryErrorMessage = '';
    var genresErrorMessage = '';
    var formErrorMessage = '';
    var tagsErrorMessage = '';
    var ratingErrorMessage = '';
    var statusErrorMessage = '';

    onMount(() => {
        tags.fetchTagsTrees(TagKind.Fandom).subscribe((tagTrees) => {
            for (const tree of tagTrees) {
                tagOptions = [...tagOptions, { value: tree._id, label: tree.name }]
                for (const child of tree.children) {
                    tagOptions = [...tagOptions, { value: child._id, label: tree.name + " — " + child.name }]
                }
            }
        })
    })

    const { form, data, errors } = createForm({
        onSubmit: async (values) => {
            const formInfo: CreatePoetry = {
                title: values.title,
                desc: values.shortDesc,
                body: values.longDesc,
                category: values.category.value,
                form: values.poetryForm.value,
                genres: values.genres.map((val) => {
                    return val.value;
                }),
                tags: values.tags ? values.tags.map((val) => {
                    return val.value;
                }) : [],
                rating: values.rating.value,
                status: values.status.value,
            };

            await createOne($session.currProfile._id, ContentKind.PoetryContent, formInfo).then(
                (res) => {
                    goto(`/poetry/${res.data._id}`);
                },
            );
        },
        validate: (values) => {
            const errors = {
                title: '',
                category: '',
                genres: '',
                poetryForm: '',
                tags: '',
                shortDesc: '',
                longDesc: '',
                rating: '',
                status: '',
            };
            
            categoryErrorMessage = '';
            genresErrorMessage = '';
            formErrorMessage = '';
            tagsErrorMessage = '';
            ratingErrorMessage = '';
            statusErrorMessage = '';

            if (
                !values.title ||
                values.title.length < MIN_TITLE_LENGTH || values.title.length > MAX_TITLE_LENGTH
            ) {
                errors.title = `Titles must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`;
            }

            if (!values.category) {
                categoryErrorMessage = 'You must select a category';
                errors.category = categoryErrorMessage;
            }

            if (
                !values.genres ||
                values.genres.length < MIN_GENRE || values.genres.length > MAX_GENRES
            ) {
                genresErrorMessage = `You must select at least ${MIN_GENRE} but no more than ${MAX_GENRES}`;
                errors.genres = genresErrorMessage;
            }

            if (!values.poetryForm) {
                formErrorMessage = 'You must select a form';
                errors.poetryForm = formErrorMessage;
            }

            if (values.tags && values.tags.length > MAX_FANDOM_TAGS) {
                tagsErrorMessage = `You can select no more than ${MAX_FANDOM_TAGS} tags`;
                errors.tags = tagsErrorMessage;
            }

            if (
                !values.shortDesc ||
                values.shortDesc.length < MIN_SHORT_DESC_LENGTH ||
                values.shortDesc.length > MAX_SHORT_DESC_LENGTH
            ) {
                errors.shortDesc = `Short descriptions must be between ${MIN_SHORT_DESC_LENGTH} and ${MAX_SHORT_DESC_LENGTH} characters`;
            }

            if (!values.longDesc || values.longDesc.length < MIN_LONG_DESC_LENGTH) {
                errors.longDesc = `Long descriptions must be more than ${MIN_LONG_DESC_LENGTH} long`;
            }

            if (!values.rating) {
                ratingErrorMessage = `You must select a rating`;
                errors.rating = ratingErrorMessage;
            }

            if (!values.status) {
                statusErrorMessage = `You must select a status`;
                errors.status = statusErrorMessage;
            }

            return errors;
        },
    });

    const categories = Object.entries(WorkKind).map(([key, value]) => ({
        value: key,
        label: value,
    })).sort((a, b) => (a.value < b.value ? -1 : 1));
    const genres = Object.entries(Genres).map(([key, value]) => ({
        value: key,
        label: value
    })).sort((a, b) => (a.value < b.value ? -1 : 1));
    const ratings = Object.entries(ContentRating).map(([key, value]) => ({
        value: key,
        label: value,
    }));
    const statuses = Object.entries(WorkStatus).map(([key, value]) => ({
        value: key,
        label: value,
    }));
    const poetryForms = Object.entries(PoetryFormKind).map(([key, value]) => ({
        value: key,
        label: value,
    })).sort((a, b) => (a.value < b.value ? -1 : 1));
</script>

<svelte:head>
    <title>Create Poetry &mdash; Offprint</title>
</svelte:head>

<div class="w-full h-screen overflow-y-auto">
    <div class="max-w-4xl w-11/12 md:w-7/12 mx-auto my-10 mb-6">
        <h1 class="text-center text-4xl font-medium">Create New Poetry</h1>
        <form use:form>
            <TextField
                name="title"
                type="text"
                title="Title"
                placeholder="A Brand New World"
                errorMessage={$errors.title}
            />
            <div class="flex items-center my-4">
                <div class="w-1/3">
                    <SelectMenu
                        items={categories}
                        label="Category"
                        on:select={(e) => {
                            $data.category = e.detail;
                        }}
                        errorMessage={categoryErrorMessage}
                    />
                </div>
                <div class="mx-2" />
                <div class="w-1/3">
                    <SelectMenu
                        items={genres}
                        label="Genre(s)"
                        isMulti={true}
                        on:select={(e) => {
                            $data.genres = e.detail;
                        }}
                        errorMessage={genresErrorMessage}
                    />
                </div>
                <div class="mx-2" />
                <div class="w-1/3">
                    <SelectMenu
                        items={poetryForms}
                        label="Form"
                        on:select={(e) => {
                            $data.poetryForm = e.detail;
                        }}
                        errorMessage={formErrorMessage}
                    />
                </div>
            </div>
            {#if $data.category && $data.category.value === WorkKind.Fanwork}
                <SelectMenu
                    items={tagOptions}
                    label="Fandom Tag(s)"
                    isMulti={true}
                    on:select={(e) => {
                        $data.tags = e.detail;
                    }}
                    errorMessage={tagsErrorMessage}
                />
            {/if}
            <TextField
                name="shortDesc"
                type="text"
                title="Short Description"
                placeholder="One of the best things never told"
                errorMessage={$errors.shortDesc}
            />
            <div class="my-4" />
            <Editor label="Long Description" bind:value={$data.longDesc} />
            <div class="flex items-center mt-4">
                <div class="w-1/2">
                    <SelectMenu
                        items={ratings}
                        label="Rating"
                        on:select={(e) => {
                            $data.rating = e.detail;
                        }}
                        errorMessage={ratingErrorMessage}
                    />
                </div>
                <div class="mx-2" />
                <div class="w-1/2">
                    <SelectMenu
                        items={statuses}
                        label="Status"
                        on:select={(e) => {
                            $data.status = e.detail;
                        }}
                        errorMessage={statusErrorMessage}
                    />
                </div>
            </div>
            <div class="flex items-center justify-center mt-6">
                <Button type="button">
                    <CloseLine class="button-icon" />
                    <span class="button-text">Cancel</span>
                </Button>
                <div class="mx-2" />
                <Button type="submit">
                    <Save2Line class="button-icon" />
                    <span class="button-text">Save</span>
                </Button>
            </div>
        </form>
    </div>
</div>
