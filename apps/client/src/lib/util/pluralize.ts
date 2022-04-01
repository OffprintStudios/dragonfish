/**
 * Adds a plural prefix to a word to either indicate one or many of some value.
 * @param value
 * @param prefix
 */
export function pluralize(value: number, prefix?: string): string {
    if (prefix) {
        if (value === 0 || value > 1) {
            return prefix;
        } else {
            return '';
        }
    } else if (value === 0 || value > 1) {
        return 's';
    } else {
        return '';
    }
}
