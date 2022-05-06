<script lang="ts">
    import { CloseLine, MailSendLine } from 'svelte-remixicon';
    import { createForm } from 'felte';
    import { closePopup, popup } from '$lib/components/nav/popup';
    import { Button } from '$lib/components/ui/misc';
    import type { NewMessageForm } from '$lib/models/messages';
    import { session } from '$lib/repo/session.repo';
    import { sendPrivateMessage } from '$lib/services/messages.service';
    import { failure, success } from '$lib/services/alerts.service';

    $: items = $popup.data;

    const { form, isSubmitting } = createForm({
        onSubmit: async (values) => {
            const newMessage: NewMessageForm = {
                senderId: $session.currProfile._id,
                recipientId: items.profileId,
                name: values.name,
                message: values.message,
            };

            await sendPrivateMessage(newMessage).then(() => {
                success(`Message sent!`);
                closePopup();
            }).catch(() => {
                failure(`Something went wrong!`);
            });
        },
        validate: (values) => {
            const errors = {
                name: '',
                message: ''
            };

            if (values.name === null || values.name.length < 3 || values.name.length > 120) {
                errors.name = 'Subject must be between 3 and 120 characters long.';
            }

            if (values.message === null || values.message.length < 3 || values.message.length > 1000) {
                errors.message = 'Messages must be between 3 and 1000 characters long.';
            }

            return errors;
        },
        initialValues: {
            name: null,
            message: null,
        }
    })
</script>

<div class="send-message-box bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed">
    <div class="flex items-center border-b-2 border-zinc-500 px-4 py-2 w-full">
        <h3 class="font-medium text-2xl flex-1">Send Message</h3>
        <Button on:click={closePopup}>
            <CloseLine size="20px" class="button-icon no-text" />
        </Button>
    </div>
    <form class="flex-1 p-4 w-[24rem]" use:form>
        <input
            type="text"
            name="name"
            placeholder="Subject"
            class="mb-4 rounded-lg w-full bg-zinc-400 dark:bg-zinc-500 ring-0 placeholder-zinc-300 dark:placeholder-zinc-400 px-1.5 py-2.5 border-0"
        />
        <textarea
            class="rounded-lg w-full bg-zinc-400 dark:bg-zinc-500 ring-0 placeholder-zinc-300 dark:placeholder-zinc-400 px-1.5 py-2.5 border-0 min-h-[1rem]"
            name="message"
            placeholder="Message"
        ></textarea>
        <div class="flex items-center justify-center mt-2">
            <Button type="submit" isLoading={$isSubmitting}>
                <MailSendLine class="button-icon" />
                <span class="button-text">Send</span>
            </Button>
        </div>
    </form>
</div>

<style lang="scss">
    div.send-message-box {
        @apply rounded-lg max-h-screen;
        box-shadow: var(--dropshadow);
    }
</style>