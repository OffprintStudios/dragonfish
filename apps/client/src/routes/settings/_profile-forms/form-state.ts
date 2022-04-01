import { writable } from 'svelte/store';
import type { Profile } from '$lib/models/accounts';
import { updateAvatar, updateDisplayName, updateBio } from '$lib/repo/session.repo';

interface ProfileSettings {
    profiles: Profile[];
    currProfile: Profile;
}

export const profileSettings = writable<ProfileSettings>({
    profiles: null,
    currProfile: null,
});

export function setProfileSettings(profiles: Profile[]): void {
    profileSettings.set({
        profiles,
        currProfile: null,
    });
}

export function setCurrProfile(profileId: string): void {
    console.log(`setting profile with ID: ${profileId}`);
    profileSettings.update((state) => {
        if (
            state.currProfile !== null &&
            state.currProfile !== undefined &&
            state.currProfile._id === profileId
        ) {
            state.currProfile = null;
        } else {
            state.currProfile = state.profiles.find((profile) => profile._id === profileId);
        }
        return state;
    });
}

export function updateAvatarForm(profileId: string, newProfile: Profile): void {
    profileSettings.update((state) => {
        const index = state.profiles.findIndex((item) => item._id === profileId);
        state.profiles[index].profile.avatar = newProfile.profile.avatar;
        state.currProfile.profile.avatar = newProfile.profile.avatar;
        return state;
    });

    updateAvatar(profileId, newProfile.profile.avatar);
}

export function updateDisplayNameForm(profileId: string, newDisplayName: string): void {
    profileSettings.update((state) => {
        const index = state.profiles.findIndex((item) => item._id === profileId);
        state.profiles[index].screenName = newDisplayName;
        state.currProfile.screenName = newDisplayName;
        return state;
    });

    updateDisplayName(profileId, newDisplayName);
}

export function updateBioForm(profileId: string, newBio: string): void {
    profileSettings.update((state) => {
        const index = state.profiles.findIndex((item) => item._id === profileId);
        state.profiles[index].profile.bio = newBio;
        state.currProfile.profile.bio = newBio;
        return state;
    });

    updateBio(profileId, newBio);
}
