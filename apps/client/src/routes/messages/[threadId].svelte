<script lang="ts">
    import { page } from '$app/stores';
    import { io } from 'socket.io-client';
    import { createForm } from 'felte';
    import { session } from '$lib/repo/session.repo';
    import { baseUrl } from '$lib/util';
    import type { PaginateResult } from '$lib/models/util';
    import type { Message, SendMessageForm } from '$lib/models/messages';
    import { InformationLine, MailSendLine } from 'svelte-remixicon';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';
    import Time from '$lib/components/ui/misc/Time.svelte';

    const threadId = $page.params.threadId;
    let messages: PaginateResult<Message> = null;
    const socket = io(`${baseUrl}/messages`, {
        auth: {
            token: $session.token,
            pseudId: $session.currProfile._id,
        },
        transports: ['websocket'],
    });

    socket.emit('join-room', { threadId, pseudId: $session.currProfile._id});
    socket.on('thread', (data) => {
        messages = data;
    });
    socket.on('message', (data) => {
        if (messages !== null) {
            messages.docs = [...messages.docs, data];
        }
    });

    const { form, reset } = createForm({
        onSubmit: (values) => {
            const newMessage: SendMessageForm = {
                message: values.message,
                senderId: $session.currProfile._id,
                threadId: threadId
            };
            socket.emit('send-message', { data: newMessage });
            resetForm();
        },
        validate: (values) => {
            const errors = {
                message: '',
            };

            if (values.message && (values.message.length < 3 || values.message.length > 1000)) {
                errors.message = 'Message should be between 3 and 1000 characters.';
            }

            return errors;
        },
        initialValues: {
            message: null,
        }
    });

    function resetForm() {
        reset();
    }
</script>

<div class="h-screen flex flex-col">
    <div class="flex-1"></div>
    <div class="messages-feed">
        {#if messages !== null}
            {#each messages.docs.reverse() as message}
                <div class="message" class:end={message.user._id === $session.currProfile._id}>
                    <Avatar src={message.user.profile.avatar} size="42px" borderWidth="1px" />
                    <div class="flex flex-col mx-2">
                        <div class="flex items-center">
                            <h5 class="font-medium text-lg relative">{message.user.screenName}</h5>
                            <span class="text-xs italic relative top-0.5 ml-2"><Time relative live timestamp={message.createdAt} /></span>
                        </div>
                        <div>{message.message}</div>
                    </div>
                </div>
            {:else}
                <div class="h-full flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <InformationLine class="mr-2" />
                        <span class="font-bold text-sm uppercase tracking-widest">Nothing Posted Yet</span>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
    <form class="new-message-box" use:form>
        <input
            class="w-full min-h-[4rem] px-4 bg-zinc-300 dark:bg-zinc-700 ring-0 border-r-2 border-zinc-500 border-t-0 border-b-0 border-l-0"
            name="message"
            placeholder="Send a message..."
        />
        <button class="px-6 bg-zinc-300 dark:bg-zinc-700 min-h-[4rem]" type="submit" title="Send message">
            <MailSendLine size="24px" />
        </button>
    </form>
</div>

<style lang="scss">
    div.messages-feed {
        @apply overflow-y-auto p-4;
        div.message {
            @apply flex justify-start w-full my-4;
            /*&.end {
                @apply justify-end;
            }*/
        }
    }
    form.new-message-box {
        @apply w-full min-h-[4rem] border-t flex items-center;
    }
</style>