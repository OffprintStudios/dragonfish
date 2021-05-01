import { HttpError } from '@dragonfish/shared/models/util';

/**
 * Attempts to parse an HttpError.
 *
 * @param response The response to parse
 * @returns HttpError | null
 */
export function tryParseJsonHttpError(response: string): HttpError | null {
    try {
        const error: HttpError = JSON.parse(response);
        return error;
    } catch (err) {
        return null;
    }
}
