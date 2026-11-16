export type Role = 'Admin' | 'Moderator' | 'WorkApprover' | 'ChatModerator' | 'Contributor' | 'User';

export const VALID_ROLES: Role[] = ['Admin', 'Moderator', 'WorkApprover', 'ChatModerator', 'Contributor', 'User'];

export function intoThemed(role: Role): string {
    switch (role) {
        case 'Admin':
            return 'Manager'; 
        case 'Moderator':
            return 'Barista';
        case 'ChatModerator':
            return 'Attendant';
        case 'WorkApprover':
            return 'Quality Control';
        case 'Contributor':
            return 'Comrade';
        case 'User':
            return 'Patron';
    }
}