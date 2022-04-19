import { writable } from 'svelte/store';
import type { FollowingUser } from '$lib/models/activity';
import { fetchFollowing } from '$lib/services/profile.service';

interface FollowState {
    allFollows: FollowingUser[];
    currFollow: FollowingUser;
}

export const following = writable<FollowState>({ allFollows: [], currFollow: null });

export async function setFollows(profileId: string) {
    return await fetchFollowing(profileId).then(res => {
        following.update(state => ({
            allFollows: res,
            ...state,
        }));
        return res;
    });
}