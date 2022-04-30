<script lang="ts">
    import {
        Genres,
        Poetry,
        PoetryFormKind,
        TagKind,
        TagsModel,
        WorkKind,
        WorkStatus,
    } from '$lib/models/content/works';
    import { ContentKind, ContentRating } from '$lib/models/content';
    import { onMount, createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { content, updateContent } from '$lib/repo/content.repo';
    import { createForm } from 'felte';
    import type { CreatePoetry } from '$lib/models/content/works/forms';
    import { saveChanges } from '$lib/services/content.service';
    import { session } from '$lib/repo/session.repo';
    import {
        MAX_FANDOM_TAGS,
        MAX_GENRES,
        MAX_SHORT_DESC_LENGTH,
        MAX_TITLE_LENGTH,
        MIN_GENRE,
        MIN_LONG_DESC_LENGTH,
        MIN_SHORT_DESC_LENGTH,
        MIN_TITLE_LENGTH,
    } from '$lib/util';
    import { tags } from '$lib/services';
    import { TextField, SelectMenu, Editor } from '$lib/components/forms';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { Save2Line } from 'svelte-remixicon';
    import { success } from '$lib/services/alerts.service';

    const dispatch = createEventDispatcher();
    var tagOptions = [];

    var categoryErrorMessage = '';
    var genresErrorMessage = '';
    var tagsErrorMessage = '';
    var ratingErrorMessage = '';
    var statusErrorMessage = '';
    var formErrorMessage = '';

    const categories = Object.entries(WorkKind)
        .map(([key, value]) => ({
            value: key,
            label: value,
        }))
        .sort((a, b) => (a.value < b.value ? -1 : 1));
    const genres = Object.entries(Genres)
        .map(([key, value]) => ({
            value: key,
            label: value,
        }))
        .sort((a, b) => (a.value < b.value ? -1 : 1));
    const ratings = Object.entries(ContentRating).map(([key, value]) => ({
        value: key,
        label: value,
    }));
    const statuses = Object.entries(WorkStatus).map(([key, value]) => ({
        value: key,
        label: value,
    }));
    const poetryForms = Object.entries(PoetryFormKind)
        .map(([key, value]) => ({
            value: key,
            label: value,
        }))
        .sort((a, b) => (a.value < b.value ? -1 : 1));

    let tagValues: any[];

    onMount(() => {
        tags.fetchTagsTrees(TagKind.Fandom).subscribe((tagTrees) => {
            for (const tree of tagTrees) {
                tagOptions = [...tagOptions, { value: tree._id, label: tree.name }];
                for (const child of tree.children) {
                    tagOptions = [
                        ...tagOptions,
                        { value: child._id, label: tree.name + ' — ' + child.name },
                    ];
                }
            }
            tagValues = mapTags(($content.content as Poetry).tags);
            $data.tags = tagValues;
        });
    });

    function mapGenres(theseGenres: Genres[]) {
        const genresList = [];
        for (let i = 0; i < theseGenres.length; i++) {
            const thisGenre = genres.find((item) => {
                const genre = Genres[theseGenres[i]];
                return item.label === genre;
            });
            genresList.push(thisGenre);
        }
        return genresList;
    }

    function mapTags(theseTags: TagsModel[]) {
        const tagsList = [];
        if (theseTags) {
            for (let i = 0; i < theseTags.length; i++) {
                const thisTag = tagOptions.find((item) => {
                    return item.value === theseTags[i]._id;
                });
                if (thisTag) {
                    tagsList.push(thisTag);
                }
            }
        }
        return tagsList;
    }

    const { form, data, errors, isSubmitting } = createForm({
        onSubmit: async (values) => {
            const formInfo: CreatePoetry = {
                title: values.title,
                desc: values.shortDesc,
                body: values.longDesc,
                category: values.category.value,
                genres: values.genres.map((val) => {
                    return val.value;
                }),
                form: values.poetryForm.value,
                tags: tagValues
                    ? tagValues.map((val) => {
                          return val.value;
                      })
                    : [],
                rating: values.rating.value,
                status: values.status.value,
            };

            await saveChanges(
                $session.currProfile._id,
                $content.content._id,
                ContentKind.PoetryContent,
                formInfo,
            ).then((res) => {
                updateContent(res);
                success(`Changes saved!`);
                dispatch('saved');
            });
        },
        validate: (values) => {
            const errors = {
                title: '',
                category: '',
                genres: '',
                tags: '',
                shortDesc: '',
                longDesc: '',
                poetryForm: '',
                rating: '',
                status: '',
            };

            if (
                !values.title ||
                values.title.length < MIN_TITLE_LENGTH ||
                values.title.length > MAX_TITLE_LENGTH
            ) {
                errors.title = `Titles must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`;
            }

            if (!values.category) {
                categoryErrorMessage = 'You must select a category';
                errors.category = categoryErrorMessage;
            }

            if (
                !values.genres ||
                values.genres.length < MIN_GENRE ||
                values.genres.length > MAX_GENRES
            ) {
                genresErrorMessage = `You must select at least ${MIN_GENRE} but no more than ${MAX_GENRES}`;
                errors.genres = genresErrorMessage;
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

            if (!values.poetryForm) {
                formErrorMessage = 'You must select a form';
                errors.poetryForm = formErrorMessage;
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
        initialValues: {
            title: $content.content.title,
            shortDesc: $content.content.desc,
            longDesc: $content.content.body,
            category: categories.find(
                (item) => item.value === WorkKind[($content.content as Poetry).meta.category],
            ),
            rating: ratings.find(
                (item) => item.value === ContentRating[($content.content as Poetry).meta.rating],
            ),
            poetryForm: poetryForms.find(
                (item) => item.value === PoetryFormKind[($content.content as Poetry).meta.form],
            ),
            genres: mapGenres(($content.content as Poetry).meta.genres),
            tags: [], // tags are loaded after this code is run
            status: statuses.find(
                (item) => item.value === WorkStatus[($content.content as Poetry).meta.status],
            ),
        },
    });
</script>

<form use:form in:fade={{ delay: 0, duration: 150 }}>
    <div class="flex items-center border-b border-zinc-700 dark:border-white pb-1">
        <div class="flex-1">
            <h3 class="text-2xl font-medium">Editing Info</h3>
        </div>
        <Button type="submit" loading={$isSubmitting} loadingText="Saving...">
            <Save2Line class="button-icon" />
            <span class="button-text">Save</span>
        </Button>
    </div>
    <TextField
        name="title"
        type="text"
        title="Title"
        placeholder="A Brand New World"
        errorMessage={$errors.title}
    />
    <div class="flex items-center my-4 flex-wrap md:flex-nowrap">
        <div class="md:w-1/3 w-full">
            <SelectMenu
                items={categories}
                label="Category"
                bind:value={$data.category}
                on:select={(e) => {
                    $data.category = e.detail;
                }}
                errorMessage={categoryErrorMessage}
            />
        </div>
        <div class="hidden md:block md:mx-2"><!--separator--></div>
        <div class="md:w-1/3 w-full">
            <SelectMenu
                items={genres}
                label="Genre(s)"
                isMulti={true}
                bind:value={$data.genres}
                on:select={(e) => {
                    $data.genres = e.detail;
                }}
                errorMessage={genresErrorMessage}
            />
        </div>
        <div class="hidden md:block md:mx-2"><!--separator--></div>
        <div class="md:w-1/3 w-full">
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
            bind:value={tagValues}
            on:select={(e) => {
                tagValues = e.detail;
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
    <div class="my-4"><!--separator--></div>
    <Editor label="Long Description" bind:value={$data.longDesc} />
    <div class="flex items-center mt-4 flex-wrap md:flex-nowrap">
        <div class="md:w-1/2 w-full">
            <SelectMenu
                items={ratings}
                label="Rating"
                bind:value={$data.rating}
                on:select={(e) => {
                    $data.rating = e.detail;
                }}
                errorMessage={ratingErrorMessage}
            />
        </div>
        <div class="hidden md:block md:mx-2"><!--separator--></div>
        <div class="md:w-1/2 w-full">
            <SelectMenu
                items={statuses}
                label="Status"
                bind:value={$data.status}
                on:select={(e) => {
                    $data.status = e.detail;
                }}
                errorMessage={statusErrorMessage}
            />
        </div>
    </div>
</form>
