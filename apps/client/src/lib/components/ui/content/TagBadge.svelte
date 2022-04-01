<script lang="ts">
    import { Genres, TagKind, TagsModel, WorkKind } from '$lib/models/content/works';
    import { ContentKind, ContentRating } from '$lib/models/content';
    import {
        BookOpenLine,
        QuillPenLine,
        EmpathizeLine,
        Loader2Line,
        EmotionLaughLine,
        FilePaper2Line,
        DoorClosedLine,
        MagicLine,
        Ghost2Line,
        SearchEyeLine,
        HeartsLine,
        AliensLine,
        Home3Line,
        MeteorLine,
        SpyLine,
        SkullLine,
        SwordLine,
    } from 'svelte-remixicon';
    import { slugify } from '$lib/util';
    import { formatTagName } from '$lib/util/format-tag-name';

    export let size: 'small' | 'medium' | 'large' = 'medium';
    export let hasIcon = true;
    export let kind: TagKind;
    export let type: ContentKind = null;
    export let category: WorkKind = null;
    export let genre: Genres = null;
    export let rating: ContentRating = null;
    export let tag: TagsModel = null;
</script>

<div
    class="tag-pill"
    class:fandom={kind === TagKind.Fandom}
    class:warning={kind === TagKind.Warning}
    class:category={kind === TagKind.Category}
    class:genre={kind === TagKind.Genre}
    class:type={kind === TagKind.Type}
    class:user={kind === TagKind.User}
    class:no-text={size === 'small'}
    class:big-text={size === 'large'}
    class:no-icon={!hasIcon}
    class:everyone={rating === ContentRating.Everyone}
    class:teen={rating === ContentRating.Teen}
    class:mature={rating === ContentRating.Mature}
    class:explicit={rating === ContentRating.Explicit}
>
    {#if kind === TagKind.Type}
        {#if type === ContentKind.ProseContent}
            <BookOpenLine />
            <span class="tag-label">Prose</span>
        {:else if type === ContentKind.PoetryContent}
            <QuillPenLine />
            <span class="tag-label">Poetry</span>
        {/if}
    {:else if kind === TagKind.Category}
        {#if category === WorkKind.Fanwork}
            <EmpathizeLine />
            <span class="tag-label">Fanwork</span>
        {:else if category === WorkKind.Original}
            <Loader2Line />
            <span class="tag-label">Original</span>
        {/if}
    {:else if kind === TagKind.Genre}
        {#if genre === Genres.Comedy}
            <EmotionLaughLine />
            <span class="tag-label">Comedy</span>
        {:else if genre === Genres.Drama}
            <FilePaper2Line />
            <span class="tag-label">Drama</span>
        {:else if genre === Genres.Erotica}
            <DoorClosedLine />
            <span class="tag-label">Erotica</span>
        {:else if genre === Genres.Fantasy}
            <MagicLine />
            <span class="tag-label">Fantasy</span>
        {:else if genre === Genres.Horror}
            <Ghost2Line />
            <span class="tag-label">Horror</span>
        {:else if genre === Genres.Mystery}
            <SearchEyeLine />
            <span class="tag-label">Mystery</span>
        {:else if genre === Genres.Romance}
            <HeartsLine />
            <span class="tag-label">Romance</span>
        {:else if Genres[genre] === Genres.ScienceFiction}
            <AliensLine />
            <span class="tag-label">Science Fiction</span>
        {:else if Genres[genre] === Genres.SliceOfLife}
            <Home3Line />
            <span class="tag-label">Slice of Life</span>
        {:else if Genres[genre] === Genres.SpeculativeFiction}
            <MeteorLine />
            <span class="tag-label">Speculative Fiction</span>
        {:else if genre === Genres.Thriller}
            <SpyLine />
            <span class="tag-label">Thriller</span>
        {:else if genre === Genres.Tragedy}
            <SkullLine />
            <span class="tag-label">Tragedy</span>
        {:else if Genres[genre] === Genres.ActionAdventure}
            <SwordLine />
            <span class="tag-label">Action/Adventure</span>
        {/if}
    {:else if kind === TagKind.Rating}
        {#if rating === ContentRating.Everyone}
            <span class="tag-label">Everyone</span>
            <span class="rating-label-small">E</span>
        {:else if rating === ContentRating.Teen}
            <span class="tag-label">Teen</span>
            <span class="rating-label-small">T</span>
        {:else if rating === ContentRating.Mature}
            <span class="tag-label">Mature</span>
            <span class="rating-label-small">M</span>
        {:else if rating === ContentRating.Explicit}
            <span class="tag-label">Explicit</span>
            <span class="rating-label-small">X</span>
        {/if}
    {:else if kind === TagKind.Fandom && tag !== null}
        <span class="tag-label">
            <a href="/tag/{tag._id}/{slugify(tag.name)}">
                {formatTagName(tag)}
            </a>
        </span>
    {/if}
</div>

<style lang="scss">
    div.tag-pill {
        @apply px-1 py-0.5 flex items-center rounded-md mx-0.5 mt-1 text-white transition transform cursor-pointer h-[1.75rem];
        :global(svg) {
            @apply w-4 relative mr-1;
        }

        span.tag-label {
            @apply text-sm;
            a {
                @apply font-light text-white;
            }
        }

        span.rating-label-small {
            @apply hidden text-sm font-medium;
        }

        &.no-text {
            @apply px-1.5;
            :global(svg) {
                @apply mr-0;
            }

            span.tag-label {
                @apply hidden;
            }

            &.no-icon {
                @apply px-2 py-0.5;
                span.rating-label-small {
                    @apply block;
                }
            }
        }

        &.big-text {
            :global(svg) {
                @apply w-6 mr-0.5;
            }

            span.tag-label {
                @apply text-sm mr-1;
            }
        }

        &:hover {
            @apply scale-105;
        }

        &:active {
            @apply scale-100;
        }

        &.fandom {
            @apply bg-gray-500 hover:bg-gray-600;
        }

        &.warning {
        }

        &.category {
            @apply bg-purple-600 hover:bg-purple-800;
        }

        &.genre {
            @apply bg-green-600 hover:bg-green-800;
        }

        &.type {
            @apply bg-indigo-600 hover:bg-indigo-800;
        }

        &.user {
        }

        &.everyone {
            @apply bg-green-700 hover:bg-green-900;
        }

        &.teen {
            @apply bg-yellow-400 hover:bg-yellow-600;
        }

        &.mature {
            @apply bg-yellow-700 hover:bg-yellow-900;
        }

        &.explicit {
            @apply bg-red-700 hover:bg-red-900;
        }

        &.no-icon {
            @apply py-1;
        }
    }
</style>
