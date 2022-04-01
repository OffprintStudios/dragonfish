<script lang="ts">
    import { createForm } from 'felte';
    import { session } from '$lib/repo/session.repo';
    import { comments } from '$lib/repo/comments.repo';
    import { addComment } from '$lib/repo/comments.repo';
    import Editor from '$lib/components/forms/Editor.svelte';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { CheckLine } from 'svelte-remixicon';
    import type { CommentForm } from '$lib/models/comments';

    const { form, data, reset } = createForm({
        onSubmit: async (values) => {
            const formData: CommentForm = {
                body: values.body,
                repliesTo: [],
            };

            await addComment(
                $session.currProfile._id,
                $comments.threadId,
                $comments.kind,
                formData,
            ).then(() => {
                console.log(`attempting to reset`);
                resetForm();
            });
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
    });

    function resetForm() {
        reset();
    }
</script>

<form use:form>
    <div
        class="add-comment bg-zinc-300 dark:bg-zinc-700 border-b-2 border-zinc-300 dark:border-zinc-500 dark:highlight-shadowed"
    >
        <Avatar size="2.5rem" borderWidth="2px" src={$session.currProfile.profile.avatar} />
        <div class="mx-1"><!--spacer--></div>
        <h3 class="text-xl font-medium">Add a comment</h3>
        <div class="flex-1"><!--spacer--></div>
        <Button type="submit">
            <CheckLine class="button-icon" />
            <span class="button-text">Post</span>
        </Button>
    </div>
    <Editor hasHeader="true" bind:value={$data.body} />
</form>

<style lang="scss">
    div.add-comment {
        @apply rounded-t-lg flex items-center w-full p-2 select-none;
    }
</style>
