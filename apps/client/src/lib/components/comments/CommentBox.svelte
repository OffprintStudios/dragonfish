<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { createForm } from 'felte';
    import type { Comment } from '$lib/models/comments';
    import { localeDate } from '$lib/util';
    import {
        More2Line,
        ReplyLine,
        Emotion2Line,
        Edit2Line,
        CloseLine,
        Save2Line,
    } from 'svelte-remixicon';
    import Editor from '$lib/components/forms/Editor.svelte';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { CommentForm } from '$lib/models/comments';
    import { editComment } from '$lib/repo/comments.repo';
    import { session } from '$lib/repo/session.repo';
    import Time from '$lib/components/ui/misc/Time.svelte';

    export let comment: Comment;
    export let index = 1;

    const dispatch = createEventDispatcher();
    let isEditing = false;

    const { form, data, reset, createSubmitHandler } = createForm({
        onSubmit: () => {
            console.log(`Alt submit used!`);
        },
        validate: (values) => {
            const errors = {
                body: '',
            };

            if (!values.body || values.body.length < 10) {
                errors.body = 'Comments must be at least 10 characters long.';
            }

            return errors;
        },
        initialValues: {
            body: comment.body,
        },
    });

    const saveChanges = createSubmitHandler({
        onSubmit: async (values) => {
            const formData: CommentForm = {
                body: values.body,
                repliesTo: [],
            };

            await editComment($session.currProfile._id, comment._id, formData).then(() => {
                isEditing = false;
                resetForm();
            });
        },
    });

    function resetForm() {
        reset();
    }

    function reply() {
        dispatch('reply', comment);
    }
</script>

<div class="comment-box bg-zinc-300 dark:bg-zinc-700">
    <div class="flex items-center border-b-2 border-transparent dark:border-zinc-500 px-2 py-0.5">
        <Avatar src={comment.user.profile.avatar} size="2.5rem" borderWidth="2px" />
        <div class="ml-2 flex-1">
            <h5 class="text-lg font-medium relative top-1">{comment.user.screenName}</h5>
            <div class="flex items-center relative bottom-1">
                {#if comment.user.profile.tagline}
                    {#if comment.user.profile.tagline === 'null'}
                        <span class="text-xs relative top-0.5">Member</span>
                    {:else}
                        <span class="text-xs relative top-0.5">{comment.user.profile.tagline}</span>
                    {/if}
                {:else}
                    <span class="text-xs relative top-0.5">Member</span>
                {/if}
                <span class="mx-1">•</span>
                <span class="text-xs relative top-0.5">
                    <Time timestamp={comment.createdAt} relative live />
                </span>
            </div>
        </div>
        {#if $session.currProfile && $session.currProfile._id === comment.user._id}
            {#if isEditing}
                <Button on:click={saveChanges}>
                    <Save2Line class="button-icon" />
                    <span class="button-text">Save</span>
                </Button>
                <div class="mx-0.5"><!--separator--></div>
                <Button on:click={() => (isEditing = !isEditing)}>
                    <CloseLine class="button-icon" />
                    <span class="button-text">Cancel</span>
                </Button>
            {:else}
                <Button on:click={() => (isEditing = !isEditing)}>
                    <Edit2Line class="button-icon" />
                    <span class="button-text">Edit</span>
                </Button>
            {/if}
        {:else if $session.currProfile}
            <Button on:click={reply}>
                <ReplyLine class="button-icon" />
                <span class="button-text">Reply</span>
            </Button>
            <div class="mx-0.5"><!--separator--></div>
            <Button>
                <More2Line size="20px" class="button-icon no-text" />
            </Button>
        {/if}
    </div>
    {#if isEditing}
        <form use:form in:fade|local={{ delay: 0, duration: 200 }}>
            <Editor hasHeader="true" bind:value={$data.body} />
        </form>
    {:else}
        <div class="comment-body px-4 flex-1" in:fade|local={{ delay: 0, duration: 200 }}>
            {@html comment.body}
        </div>
        <div class="flex items-center p-0.5" in:fade|local={{ delay: 0, duration: 200 }}>
            <div>
                <a class="block mx-2 relative top-0.5 text-xs">#{index}</a>
            </div>
            <div class="flex-1 text-xs relative top-0.5 text-zinc-500">
                {#if comment.history.length !== 0}
                    Last edited: <Time
                        timestamp={comment.history[comment.history.length - 1].createdAt}
                        relative
                        live
                    />
                {/if}
            </div>
            <button
                class="flex items-center rounded-lg p-2 hover:bg-transparent text-zinc-500 hover:text-zinc-800"
            >
                <Emotion2Line class="mr-1" size="14px" />
                <span class="text-xs relative top-[0.075rem]"> React </span>
            </button>
        </div>
    {/if}
</div>

<style lang="scss">
    div.comment-box {
        @apply flex flex-col w-full min-h-[14rem] rounded-lg my-4;
    }
</style>
