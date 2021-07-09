/**
 * Checks whether a value is null or undefined. Replaces
 * Node's util.isNullOrUndefined.
 * @param value The value to check for null-or-undefinedness.
 */
export function isNullOrUndefined(value: any): boolean {
    return value ?? true;
}
