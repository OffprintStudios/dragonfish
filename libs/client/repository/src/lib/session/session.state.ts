import { FrontendUser } from '@dragonfish/shared/models/users';

/**
 * Global state for authorized sessions.
 */
export interface SessionState {
    // The authorization token
    token: string | null;

    // The logged-in user
    currentUser: FrontendUser | null;

    // Any potential errors that may pop up
    error: string | null;
}

export function createInitialState(): SessionState {
    return {
        token: null,
        currentUser: null,
        error: null,
    }
}
