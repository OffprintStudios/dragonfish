import { browser } from "$app/env";
import type { Profile } from "#lib/models/accounts";
import { getContext, setContext } from "svelte";

export class AuthState {
    static key = Symbol('auth');

    profiles = $state<Profile[]>([]);
    currProfile = $state<Profile | null>(null);

    constructor() {
        if (browser) {
            const savedState = localStorage.getItem(AuthState.key.toString());
            if (savedState) {
                try {
                    this.update(JSON.parse(savedState));
                } catch (e) {
                    console.error('Failed to parse auth state: ', e);
                }
            }

            // set state to localStorage
            $effect(() => {
                const snapshot = {
                    profiles: this.profiles,
                    currProfile: this.currProfile,
                };
                localStorage.setItem(AuthState.key.toString(), JSON.stringify(snapshot));
            });

            // maintain state across tabs
            window.addEventListener('storage', (event) => {
                if (event.key === AuthState.key.toString() && event.newValue) {
                    try {
                        this.update(JSON.parse(event.newValue));
                    } catch (e) {
                        console.error('Failed to parse auth state: ', e);
                    }
                }
            });
        }
    }

    update(state: Partial<AuthState>) {
        if (state.profiles !== undefined) this.profiles = state.profiles;
        if (state.currProfile !== undefined) this.currProfile = state.currProfile;
    }

    logout() {
        this.profiles = [];
        this.currProfile = null;
    }

    static provideState(): AuthState {
        return setContext(AuthState.key, new AuthState());
    }

    static useState(): AuthState {
        return getContext<AuthState>(AuthState.key);
    }
}