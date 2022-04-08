<script lang="ts">
    import { useMutation, useQuery } from '@sveltestack/svelte-query';
    import { session } from '$lib/repo/session.repo';
    import { content } from '$lib/repo/content.repo';
    import { abbreviate, queryClient } from '$lib/util';
    import { TagKind } from '$lib/models/content/works';
    import TagBadge from '$lib/components/ui/content/TagBadge.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import {
        HeartLine,
        DislikeLine,
        HeartFill,
        DislikeFill,
        AddBoxLine,
        ImageEditLine,
    } from 'svelte-remixicon';
    import { RatingOption } from '$lib/models/content/ratings';
    import { openPopup } from '$lib/components/nav/popup';
    import UploadCoverArt from './UploadCoverArt.svelte';
    import { changeVote, fetchRatings } from '$lib/services/content.service';
    import { PubStatus } from '$lib/models/content';

    const rating = useQuery('contentRatings', () => fetchRatings($content.content._id), {
        enabled: !!$session.account && $content.content.audit.published === PubStatus.Published,
        cacheTime: 1500,
    });

    const updateVote = useMutation(
        (ratingOption: RatingOption) => changeVote($content.content._id, ratingOption),
        {
            onSuccess: (data) => {
                queryClient.setQueryData('contentRatings', data);
            },
        },
    );
</script>

<div class="work-banner">
    <div
        class="flex flex-col items-center md:items-end md:flex-row w-11/12 mx-auto md:max-w-[60rem] px-4 py-6"
    >
        {#if $content.content.meta.coverArt}
            <div class="image-container">
                <img
                    src={$content.content.meta.coverArt}
                    class="max-w-[10rem] object-contain"
                    alt="cover"
                />
                {#if $session.currProfile && $session.currProfile._id === $content.content.author._id}
                    <div class="absolute z-10 bottom-1 right-1">
                        <Button kind="primary" on:click={() => openPopup(UploadCoverArt)}>
                            <ImageEditLine class="button-icon no-text" />
                        </Button>
                    </div>
                {/if}
            </div>
        {:else if $session.currProfile && $session.currProfile._id === $content.content.author._id}
            <div class="image-upload" on:click={() => openPopup(UploadCoverArt)}>
                <AddBoxLine size="36px" />
            </div>
        {/if}
        <div class="flex flex-col md:flex-row flex-1 md:items-center md:my-4">
            <div class="flex flex-col items-center md:justify-end md:items-baseline flex-1">
                <div class="flex flex-wrap items-center">
                    <h1 class="text-4xl font-medium text-white text-center md:text-left">
                        {$content.content.title}
                    </h1>
                </div>
                <a
                    href="/profile/{$content.content.author._id}"
                    class="text-xl font-light text-white"
                    style="font-family: var(--header-text);"
                >
                    by {$content.content.author.screenName}
                </a>
                <div
                    class="flex items-center justify-center md:justify-start flex-wrap mb-4 md:mb-0"
                >
                    <TagBadge
                        kind={TagKind.Rating}
                        rating={$content.content.meta.rating}
                        hasIcon={false}
                    />
                    <TagBadge kind={TagKind.Type} type={$content.content.kind} size={'large'} />
                    <TagBadge
                        kind={TagKind.Category}
                        category={$content.content.meta.category}
                        size={'large'}
                    />
                    {#each $content.content.meta.genres as genre}
                        <TagBadge kind={TagKind.Genre} {genre} size={'large'} />
                    {/each}
                    {#each $content.content.tags as tag}
                        <TagBadge kind={TagKind.Fandom} {tag} size={'large'} />
                    {/each}
                </div>
            </div>
            <div class="flex items-center justify-center md:justify-start">
                {#if $session.account && $rating.data}
                    {#if $rating.data.rating === RatingOption.Liked}
                        <Button
                            kind="primary"
                            isActive
                            on:click={() => $updateVote.mutate(RatingOption.NoVote)}
                            title="Like"
                            loading={$updateVote.isLoading}
                            loadingText={$content.content.stats.likes}
                        >
                            <HeartFill class="button-icon" size="20px" />
                            <span class="button-text relative top-[0.02rem]">
                                {abbreviate($content.content.stats.likes)}
                            </span>
                        </Button>
                        <div class="mx-0.5"><!--separator--></div>
                        <Button
                            kind="primary"
                            on:click={() => $updateVote.mutate(RatingOption.Disliked)}
                            title="Dislike"
                            loading={$updateVote.isLoading}
                            loadingText={$content.content.stats.dislikes}
                        >
                            <DislikeLine class="button-icon" size="20px" />
                            <span class="button-text relative top-[0.02rem]">
                                {abbreviate($content.content.stats.dislikes)}
                            </span>
                        </Button>
                    {:else if $rating.data.rating === RatingOption.Disliked}
                        <Button
                            kind="primary"
                            on:click={() => $updateVote.mutate(RatingOption.Liked)}
                            title="Like"
                            loading={$updateVote.isLoading}
                            loadingText={$content.content.stats.likes}
                        >
                            <HeartLine class="button-icon" size="20px" />
                            <span class="button-text relative top-[0.02rem]">
                                {abbreviate($content.content.stats.likes)}
                            </span>
                        </Button>
                        <div class="mx-0.5"><!--separator--></div>
                        <Button
                            kind="primary"
                            isActive
                            on:click={() => $updateVote.mutate(RatingOption.NoVote)}
                            title="Dislike"
                            loading={$updateVote.isLoading}
                            loadingText={$content.content.stats.dislikes}
                        >
                            <DislikeFill class="button-icon" size="20px" />
                            <span class="button-text relative top-[0.02rem]">
                                {abbreviate($content.content.stats.dislikes)}
                            </span>
                        </Button>
                    {:else}
                        <Button
                            kind="primary"
                            on:click={() => $updateVote.mutate(RatingOption.Liked)}
                            title="Like"
                            loading={$updateVote.isLoading}
                            loadingText={$content.content.stats.likes}
                        >
                            <HeartLine class="button-icon" size="20px" />
                            <span class="button-text relative top-[0.02rem]">
                                {abbreviate($content.content.stats.likes)}
                            </span>
                        </Button>
                        <div class="mx-0.5"><!--separator--></div>
                        <Button
                            kind="primary"
                            on:click={() => $updateVote.mutate(RatingOption.Disliked)}
                            title="Dislike"
                            loading={$updateVote.isLoading}
                            loadingText={$content.content.stats.dislikes}
                        >
                            <DislikeLine class="button-icon" size="20px" />
                            <span class="button-text relative top-[0.02rem]">
                                {abbreviate($content.content.stats.dislikes)}
                            </span>
                        </Button>
                    {/if}
                {:else}
                    <Button kind="primary" disabled title="Like">
                        <HeartLine class="button-icon" size="20px" />
                        <span class="button-text relative top-[0.02rem]">
                            {abbreviate($content.content.stats.likes)}
                        </span>
                    </Button>
                    <div class="mx-0.5"><!--separator--></div>
                    <Button kind="primary" disabled title="Dislike">
                        <DislikeLine class="button-icon" size="20px" />
                        <span class="button-text relative top-[0.02rem]">
                            {abbreviate($content.content.stats.dislikes)}
                        </span>
                    </Button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    div.work-banner {
        @apply w-full text-white shadow-lg mb-6;
        background: var(--accent);
    }
    div.image-upload {
        @apply h-64 w-44 border-4 border-white rounded-lg flex flex-col items-center justify-center mb-4 md:mb-0 md:mr-4 cursor-pointer;
        &:hover {
            background: var(--accent-light);
        }
    }
    div.image-container {
        @apply border-4 border-white rounded-lg overflow-hidden md:mr-4 mb-4 md:mb-0 relative;
    }
</style>
