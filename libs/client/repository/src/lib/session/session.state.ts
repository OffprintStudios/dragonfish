import { FrontendUser } from '@dragonfish/shared/models/users';
import { FrontendAccount } from '@dragonfish/shared/models/accounts';

/**
 * Global state for authorized sessions.
 */
export interface SessionState {
    // The authorization token
    token: string | null;

    // The logged-in user
    currentUser: FrontendUser | null;

    // Logged-in account
    currAccount: FrontendAccount | null;

    // Any potential errors that may pop up
    error: string | null;
}

export function createInitialState(): SessionState {
    return {
        token: null,
        currentUser: null,
        currAccount: null,
        error: null,
    };
}
