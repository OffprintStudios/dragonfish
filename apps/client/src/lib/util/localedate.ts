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

/**
 * Takes a Date object or a string and produces a localized date in the desired format.
 * @param value
 * @param format
 */
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
