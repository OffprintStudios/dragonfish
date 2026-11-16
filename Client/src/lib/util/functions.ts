import type { Role } from "#lib/models/accounts";
import slug from "slug";
import numbro from "numbro";

/**
 * Finds the intersection between two arrays of type `T` and returns an array containing the intersecting items
 */
export function intersection<T>(a: T[], b: T[]): T[] {
    let t;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (b.length > a.length) t = b, b = a, a = t;
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}

/**
 * Checks to see if an account has the specified roles required
 */
export function hasRoles(has: Role[], needs: Role[]): boolean {
    return intersection(has, needs).length !== 0;
}

/**
 * Gets the most prominent role available for a specified user.
 */
export function getProminentRole(roles: Role[]): Role {
    if (roles.includes('Admin')) return 'Admin';
    if (roles.includes('Moderator')) return 'Moderator';
    if (roles.includes('ChatModerator')) return 'ChatModerator';
    if (roles.includes('WorkApprover')) return 'WorkApprover';
    if (roles.includes('Contributor')) return 'Contributor';
    if (roles.includes('User')) return 'User';

    return 'User';
}

/**
 * Throttles a function to limit the number of times it can be run
 */
export function throttle(
    func: (...args: unknown[]) => void,
    timeFrame: number
): (...args: unknown[]) => void {
    let lastTime = 0;
    return function (...args: unknown[]): void {
        const now: number = new Date().getTime();
        if (now - lastTime >= timeFrame) {
            func(...args);
            lastTime = now;
        }
    }
}

export function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function slugify(value: string | undefined): string {
    return slug(value ?? "");
}

export function pluralize(value: number, suffix?: string): string {
    if (value === 0 || value > 1) {
        return suffix ?? 's';
    }
    return '';
}

export function abbreviate(value: number): string {
    if (value < 1000) {
        return `${value}`;
    } else {
        return numbro(value).format({ average: true, totalLength: 2 });
    }
}

// export async function copyToClipboard(text: string) {
// 	await navigator.clipboard.writeText(text).then(() => {
// 		toast.success('Copied!');
// 	});
// }

/* localeDate */
type dateFormat =
	| 'short'
	| 'shortDate'
	| 'shortTime'
	| 'medium'
	| 'mediumDate'
	| 'mediumTime'
	| 'long'
	| 'longDate'
	| 'longTime'
	| 'full'
	| 'fullDate'
	| 'fullTime';

export function localeDate(value: Date | string, format: dateFormat = 'short'): string {
    const date = new Date(value);
    let options: Intl.DateTimeFormatOptions;

    switch (format) {
        case 'short':
            options = {
                year: '2-digit',
                month: 'numeric',
                day: 'numeric',
                hour12: true,
                hour: 'numeric',
                minute: '2-digit',
            };
            break;
        case 'shortDate':
            options = { year: '2-digit', month: 'numeric', day: 'numeric' };
            break;
        case 'shortTime':
            options = { hour12: true, hour: 'numeric', minute: '2-digit' };
            break;
        case 'medium':
            options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour12: true,
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
            };
            break;
        case 'mediumDate':
            options = { year: 'numeric', month: 'short', day: 'numeric' };
            break;
        case 'mediumTime':
            options = { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' };
            break;
        case 'long':
            options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour12: true,
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short',
            };
            break;
            case 'longDate':
                options = { year: 'numeric', month: 'long', day: 'numeric' };
                break;
            case 'longTime':
                options = {
                    hour12: true,
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'short',
                };
                break;
            case 'full':
                options = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour12: true,
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'long',
                };
                break;
            case 'fullDate':
                options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                break;
            case 'fullTime':
                options = {
                    hour12: true,
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'long',
                };
                break;
        }

	if (
		format === 'shortTime' ||
		format === 'mediumTime' ||
		format === 'longTime' ||
		format === 'fullTime'
	) {
		return date.toLocaleTimeString(undefined, options);
	} else {
		return date.toLocaleDateString(undefined, options);
	}
}

// export function throwError(msg: string): never {
//     toast.error(msg);
//     throw new Error(msg);
// }