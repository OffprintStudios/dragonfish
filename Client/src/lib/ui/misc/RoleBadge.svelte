<script lang="ts">
	import {type Role, intoThemed} from "#lib/models/accounts";
    import { getProminentRole } from "#lib/util/functions";

    let { allRoles }: { allRoles: Role[] } = $props();
    let role = () => getProminentRole(allRoles);

</script>

<div
    class="role"
    class:admin={role() === 'Admin'}
    class:moderator={role() === 'Moderator'}
    class:chat-moderator={role() === 'ChatModerator'}
    class:work-approver={role() === 'WorkApprover'}
    class:contributor={role() === 'Contributor'}
    class:user={role() === 'User'}
    title={intoThemed(role())}
>
    <span class="font-semibold tracking-wider uppercase text-[0.625rem] mx-1 relative top-[0.075rem]">
        {intoThemed(role())}
    </span>
</div>